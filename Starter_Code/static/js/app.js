// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const result = metadata.filter(sampleObj => sampleObj.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    const panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
    });
  }


// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const sampleData = samples.filter(sampleObj => sampleObj.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    const otuIDs = sampleData.otu_ids;
    const otuLabels = sampleData.otu_labels;
    const sampleValues = sampleData.sample_values;


    // Build a Bubble Chart
    const bubbleTrace = {
      x: otuIDs,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
          size: sampleValues,
          color: otuIDs,
          colorscale: 'Earth'
      }
  };

    // Render the Bubble Chart
    const bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Sample Values' }
  };

  Plotly.newPlot('bubble', [bubbleTrace], bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const yticks = otuIDs.slice(0, 10).map(id => `OTU ${id}`).reverse();

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    const barTrace = {
      x: sampleValues.slice(0, 10).reverse(),
      y: yticks,
      text: otuLabels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
  };


    // Render the Bar Chart
    const barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: { title: 'Number of Bacteria' }
  };

  Plotly.newPlot('bar', [barTrace], barLayout);
});
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sampleNames.forEach(id => {
      dropdown.append("option").text(id).property("value", id);
  });

    // Get the first sample from the list
    const firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
});
}
// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}


// Initialize the dashboard
init();
