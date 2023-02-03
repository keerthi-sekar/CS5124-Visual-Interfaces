console.log("Hello world");
const parseTime = d3.timeParse("%Y-%m-%d");

let data, data1, timelineCircles, lineChart;

d3.csv('data/disasters.csv')
  .then(_data => {
  	console.log('Data loading complete. Work with dataset.');
  	data = _data;
    console.log(data);

    //process the data - this is a forEach function.  You could also do a regular for loop.... 
    data.forEach(d => { //ARROW function - for each object in the array, pass it as a parameter to this function
      	d.cost = +d.cost; // convert string 'cost' to number
      	d.daysFromYrStart = computeDays(d.start); //note- I just created this field in each object in the array on the fly

				let tokens = d.start.split("-");
  			d.year = +tokens[0];

  	});

  	// Create an instance (for example in main.js)
		timelineCircles = new TimelineCircles({
			'parentElement': '#timeline',
			'containerHeight': 1100,
			'containerWidth': 1000
		}, data);
})
.catch(error => {
    console.error('Error loading the data');
});

d3.csv('data/sp_500_index.csv')
  .then(_data => {
    _data.forEach(d => {
      d.close = parseFloat(d.close);  // Convert string to float
      d.date = parseTime(d.date);     // Convert string to date object
    });

    data1 = _data;
    
    // Initialize and render chart
    lineChart = new LineChart({ parentElement: '#linechart'}, data1);
    lineChart.updateVis();
  })
  .catch(error => console.error(error));

/**
 * Input field event listener
 */
d3.select('#start-year-input').on('change', function() {
  // Get selected year
  const minYear = parseInt(d3.select(this).property('value'));

  // Filter dataset accordingly
  let filteredData = data1.filter(d => d.date.getFullYear() >= minYear);

  // Update chart
  lineChart.data1 = filteredData;
  lineChart.updateVis();
});

/**
 * Event listener: use color legend as filter
 */
d3.selectAll('.legend-btn').on('click', function() {
  console.log("button! ");
  // Toggle 'inactive' class
  d3.select(this).classed('inactive', !d3.select(this).classed('inactive'));
  
  // Check which categories are active
  let selectedCategory = [];
  d3.selectAll('.legend-btn:not(.inactive)').each(function() {
    selectedCategory.push(d3.select(this).attr('category'));
  });

  // Filter data accordingly and update vis
  timelineCircles.data = data.filter(d => selectedCategory.includes(d.category)) ;
  timelineCircles.updateVis();

});

function computeDays(disasterDate){
  	let tokens = disasterDate.split("-");

  	let year = +tokens[0];
  	let month = +tokens[1];
  	let day = +tokens[2];

    return (Date.UTC(year, month-1, day) - Date.UTC(year, 0, 0)) / 24 / 60 / 60 / 1000 ;

  }