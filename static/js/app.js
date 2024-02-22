const URL = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// Load data from the URL using d3.json
d3.json(URL).then(function(data) {
    // Log the loaded data for verification
    console.log(data);

    const otuData = data.samples;
    const sampleMetadata = data.metadata;
    const dropdownOptions = data.names;

    // Populate dropdown menu
    const dropdown = d3.select("#selDataset");
    dropdown.selectAll("option")
        .data(dropdownOptions)
        .enter()
        .append("option")
        .text(function(d) { return d; })
        .attr("value", function(d) { return d; });

    // Function to update charts and sample metadata based on selected individual
    function updateChartsAndMetadata(selectedIndividual) {
        // Filter OTU data for selected individual
        const selectedData = otuData.find(sample => sample.id === selectedIndividual);

        // Update charts (bar chart and bubble chart)
        updateCharts(selectedData);

        // Display sample metadata for the selected individual
        displaySampleMetadata(selectedIndividual);
    }

    // Function to update charts based on selected data
    function updateCharts(selectedData) {
        // Sort OTU data by sample values
        const sortedData = selectedData.sample_values.slice(0, 10).reverse();
        const otuIds = selectedData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
        const otuLabels = selectedData.otu_labels.slice(0, 10).reverse();

        // Define trace for the bar chart
        const trace1 = {
            x: sortedData,
            y: otuIds,
            text: otuLabels,
            type: "bar",
            orientation: "h"
        };

        // Data trace array for the bar chart
        const barData = [trace1];

        // Apply a title to the layout for the bar chart
        const layoutBar = {
            title: "Top 10 OTUs",
            xaxis: { title: "Sample Values" },
            yaxis: { title: "OTU IDs" }
        };

        // Render the bar chart to the div tag with id "bar"
        Plotly.newPlot("bar", barData, layoutBar);

        // Define trace for the bubble chart
        const traceBubble = {
            x: selectedData.otu_ids,
            y: selectedData.sample_values,
            mode: 'markers',
            marker: {
                size: selectedData.sample_values,
                color: selectedData.otu_ids,
                colorscale: 'Earth'
            },
            text: selectedData.otu_labels
        };

        // Data trace array for the bubble chart
        const bubbleData = [traceBubble];

        // Apply a title and axis labels to the layout for the bubble chart
        const layoutBubble = {
            title: 'Bubble Chart for Sample',
            xaxis: { title: 'OTU ID' },
            yaxis: { title: 'Sample Values' }
        };

        // Render the bubble chart to the div tag with id "bubble"
        Plotly.newPlot("bubble", bubbleData, layoutBubble);
    }

    // Function to display sample metadata for the selected individual
    function displaySampleMetadata(selectedIndividual) {
        // Find the metadata for the selected individual
        const metadata = sampleMetadata.find(sample => sample.id === parseInt(selectedIndividual));

        // Select the div where sample metadata will be displayed
        const metadataDiv = d3.select("#sample-metadata");

        // Clear previous metadata
        metadataDiv.html("");

        // Loop through metadata object and append each key-value pair to the div
        Object.entries(metadata).forEach(([key, value]) => {
            metadataDiv.append("p").text(`${key}: ${value}`);
        });
    }

    // Initial chart update
    updateChartsAndMetadata(dropdownOptions[0]);

    // Event listener for dropdown change
    dropdown.on("change", function() {
        const selectedIndividual = dropdown.property("value");
        updateChartsAndMetadata(selectedIndividual);
    });
})
