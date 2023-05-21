// API URL
let url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

let dropdown = d3.select("#selDataset")

//Get JSON data and console log it
function init(){
    d3.json(url).then(function(data) {
        let ddnames = data.names;
        console.log(ddnames)
        //add all ids to dropdown
        ddnames.forEach(function(id) {
            dropdown.append("option").text(id).property("value", id)
        });

        let name_id = ddnames[0];
        bbcard(name_id);
        bar_chart(name_id);
        bubble_chart(name_id);
    });   
  }

//Baseball Card
function bbcard(sample){
  d3.json(url).then(function(data) {
      let meta_info = data.metadata;
      let subject_id = meta_info.filter(function(subject){
        return subject.id==sample
      });
      let subject_info = subject_id[0];

      BaseballCard = d3.select("#sample-metadata").html("");
      Object.entries(subject_info).forEach(function([key,value]){
        BaseballCard.append("p").text(`${key}: ${value}`);
      });
  });
}

//Bar Chart
function bar_chart(sample){
  d3.json(url).then(function(data) {
      let chart_data = data.samples;
      let chart_filtered = chart_data.filter(function(subject){
        return subject.id==sample
      });
      let chart_info = chart_filtered[0];

      //Set bar chart parameters
      let x_axis = chart_info.sample_values.slice(0,10).reverse();
      let y_axis = chart_info.otu_ids.slice(0,10).map(function(id){
          return `OTU ${id}`
      }).reverse();
      let text_labels = chart_info.otu_labels.slice(0,10).reverse();

      //Generate bar chart
      let bar_chart={
          orientation: "h",
          x: x_axis,
          y: y_axis,
          text: text_labels,
          type: "bar",  
          mode: "markers",
          marker: {
              color: x_axis,
              colorscale: "Portland"
          }
      }

      //Make bar chart pretty
      let layout={
          title:`Top 10 Belly Button Bacteria for ${sample}`
      };
      
      Plotly.newPlot("bar",[bar_chart],layout);

  });
}


//Bubble graph function
function bubble_chart(sample){
  d3.json(url).then(function(data) {
      let chart_data = data.samples;
      let chart_filtered = chart_data.filter(function(subject){
        return subject.id==sample
      });
      let chart_info = chart_filtered[0];
      
      //Graph parameters
      let otu_ids = chart_info.otu_ids;
      let otu_labels = chart_info.otu_labels;
      let sample_values = chart_info.sample_values;
      
      //create bubble graph
      let bubble_chart={
          y: sample_values,
          x: otu_ids,
          text: otu_labels,
          mode: "markers",
          marker: {
              size: sample_values,
              color: otu_ids,
              colorscale: "Portland"
          }
      }

      let layout={
          title:`Bacteria Culture per Sample for ${sample}`,
          hovermode:"closest",
          xaxis:{title:"OTU ID"}
      };
      
      Plotly.newPlot("bubble", [bubble_chart], layout);

  });
}


// Update dashboard when new dropdown selection is made
function optionChanged(newSample) {
  bbcard(newSample);
  bar_chart(newSample);
  bubble_chart(newSample)
}

init();  