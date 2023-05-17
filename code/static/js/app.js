// adding JSON url
const url_json = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// reading our JSON with D3
d3.json(url_json).then(({ names }) => {
  names.forEach((id) => {
    d3.select("select").append("option").text(id);
  });
  optionChanged(); // call the function to get the ID
});

// function to handle ID selection
const optionChanged = () => {
  const IDselection = d3.select("select").node().value;
  d3.json(url_json).then(({ metadata, samples }) => {
    
    let information = metadata.filter(obj => obj.id == IDselection)[0];
    let sample = samples.filter(obj => obj.id == IDselection)[0];

    console.log("Metadata:", information); // for debugging
    console.log("Samples:", sample); // for debugging

    d3.select(".panel-body").html("");
    Object.entries(information).forEach(([key, val]) => {
      d3.select(".panel-body").append("h6").text(`${key}: ${val}`);
    });

    const { otu_ids, otu_labels, sample_values } = sample;

    // create the bar chart data
    const bar = [
      {
        x: sample_values.slice(0, 10).reverse(),
        y: otu_ids.slice(0, 10).reverse().map((x) => `OTU ${x}`),
        text: otu_labels.slice(0, 10).reverse(),
        orientation: "h",
        type: "bar",
      },
    ];
    Plotly.newPlot("bar-chart", bar); // plotting bar chart

    // create the bubble chart data
    const bubbles = [
      {
        x: otu_ids,
        y: sample_values,
        mode: "markers",
        marker: {
          color: otu_ids,
          size: sample_values,
          colorscale: "Plasma",
        },
        text: otu_labels,
      },
    ];

    // specify the layout for the bubble chart
    const bubbleLayout = {
      title: `OTU IDs vs. Sample Values for ${IDselection}`,
      titlefont: { size: 18 },
      xaxis: {
        title: "OTU ID",
        titlefont: { size: 14 },
      },
      yaxis: {
        title: "Sample Values",
        titlefont: { size: 14 },
      },
    };

    Plotly.newPlot("bubble-chart", bubbles, bubbleLayout); // plotting bubble chart
    
// BONUS
let age = information.age;
// function for plotting the gauge chart
const plotGaugeChart = (age) => {
// create the gauge chart data
  const gauge = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: age,
      title: { text: "Belly Button Washing Frequency" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 9] },
        bar: { color: "rgb(68, 166, 198)" },
        steps: [
          { range: [0, 1], color: "rgb(253, 235, 208)" },
          { range: [1, 2], color: "rgb(253, 214, 154)" },
          { range: [2, 3], color: "rgb(253, 193, 101)" },
          { range: [3, 4], color: "rgb(253, 172, 47)" },
          { range: [4, 5], color: "rgb(245, 134, 5)" },
          { range: [5, 6], color: "rgb(200, 106, 5)" },
          { range: [6, 7], color: "rgb(157, 78, 5)" },
          { range: [7, 8], color: "rgb(114, 50, 5)" },
          { range: [8, 9], color: "rgb(71, 22, 5)" },
        ],
        threshold: {
          line: { color: "orange", width: 6 },
          thickness: 0.75,
          value: age,
        },
      },
    },
  ];

  const layoutgauge = { width: 600, height: 500, margin: { t: 0, b: 0 } };
  Plotly.react("gauge-chart", gauge, layoutgauge);
};

// updating the gauge chart 
plotGaugeChart(age);

});
}