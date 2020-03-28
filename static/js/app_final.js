function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("samples.json").then((data) => {
        console.log(data)

        // get the id data to the dropdwown menu
        data.names.forEach(function (name) {
            dropdown.append("option").text(name).property("value");
        });

        // call the functions to display the data and the plots to the page
        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });

}
function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}

function getInfo(id) {
    // read the samples.json
    d3.json("samples.json").then((data) => {

        // get the metadata info for the demographic panel
        var metadata = data.metadata;

        console.log(metadata)

        // filter meta data info by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];
        console.log(result)
        //selecting the wreq for the specific id
        var wfreq_selected = result["wfreq"];
        console.log(wfreq_selected);
        // select demographic panel to put data
        var demographicInfo = d3.select("#sample-metadata");

        // empty the demographic info panel each time before getting new id info
        demographicInfo.html("");

        // grab the necessary demographic data data for the id and append the info to the panel
        Object.entries(result).forEach((key) => {
            demographicInfo.append("h4").text(key[0].toUpperCase() + ": " + key[1] + "\n");
        });
    });
}

function getPlot(id) {
    // getting data from samples.json 
    d3.json("samples.json").then((data) => {
        console.log(data)
        var result = data.metadata.filter(meta => meta.id.toString() === id)[0];
        var wfreq_selected = result["wfreq"];
        console.log(wfreq_selected);

        // filter sample values by id and store them as the string representation of the given id
        var samples = data.samples.filter(s => s.id.toString() === id)[0];

        console.log(samples);

        // get the top 10 
        var samplevalues = samples.sample_values.slice(0, 10).reverse();

        // get only top 10 otu ids for the plot OTU and reverse it
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();

        // get the otu id's to the desired form for the plot
        var OTU_id = OTU_top.map(d => "OTU " + d)

        // get the top 10 labels for the plot
        var labels = samples.otu_labels.slice(0, 10);

        console.log(`Sample Values: ${samplevalues}`)
        console.log(`Id Values: ${OTU_top}`)
        console.log(`OTU IDS: ${OTU_id}`)

        // create trace variable for the plot
        var trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
                color: 'lime'
            },
            type: "bar",
            orientation: "h",
        };

        // create data variable
        var data = [trace];

        // create layout variable to set plots layout
        var layout = {
            title: "Top 10 OTUs",
            yaxis: {
                tickmode: "linear",
            },
            margin: {
                l: 100,
                r: 50,
                t: 100,
                b: 30
            }
        };

        // create the bar plot
        Plotly.newPlot("bar", data, layout);

        console.log(samples.otu_ids)

        // The bubble chart
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids,
                colorscale: "Rainbow"
            },
            opacity: 0.75,
            text: samples.otu_labels

        };

        // set the layout for the bubble plot
        var layout_b = {
            xaxis: { title: "OTU ID" },
            yaxis: { title: "Sample values" },
            title: "OTU ID and sample values",
            height: 600,
            width: 1000,

        };

        // creating data variable 
        var data1 = [trace1];

        // create the bubble plot
        Plotly.newPlot("bubble", data1, layout_b);

        // The guage chart

        var data_g = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: parseFloat(wfreq_selected),
                title: { text: `Weekly Washing Frequency` },
                type: "indicator",

                mode: "gauge+number",
                gauge: {
                    axis: { range: [null, 9] },
                    bar: { color: "cornflowerblue" },
                    steps: [
                        { range: [0, 2], color: "red" },
                        { range: [2, 4], color: "salmon" },
                        { range: [4, 6], color: "orange" },
                        { range: [6, 8], color: "gold" },
                        { range: [8, 9], color: "yellow" },
                    ]
                }

            }
        ];
        var layout_g = {
            width: 450,
            height: 600,
            margin: { t: 20, b: 40, l: 100, r: 100 }
        };
        Plotly.newPlot("gauge", data_g, layout_g);
    });
}
init();