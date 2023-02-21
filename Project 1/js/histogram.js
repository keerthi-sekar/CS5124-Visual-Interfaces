class Histogram {

    /**
     * Class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data) {
      this.config = {
        parentElement: _config.parentElement,
        containerWidth: _config.containerWidth || 400,
        containerHeight: _config.containerHeight || 250,
        margin: _config.margin || {top: 15, right: 15, bottom: 40, left: 40},
        tooltipPadding: _config.tooltipPadding || 15
      }
      this.data = _data;
      this.initVis();
    }
    
    /**
     * We initialize scales/axes and append static elements, such as axis titles.
     */
    initVis() {
      let vis = this;
  
      // Calculate inner chart size. Margin specifies the space around the actual chart.
      vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
      vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
      
      vis.xScale = d3.scaleLinear()
          .domain([0, 10000])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
          .range([0, vis.width]);

      vis.xAxis = d3.axisBottom(vis.xScale)
        .ticks(data)
        .tickSizeOuter(0);

      vis.xAxisG = vis.chart.append('g')
          .attr('class', 'axis x-axis')
          .attr('transform', `translate(0,${vis.height})`);

      vis.svg = d3.select(vis.config.parentElement)
          .attr('width', vis.config.containerWidth)
          .attr('height', vis.config.containerHeight);

      // set the parameters for the histogram
      vis.histogram = d3.histogram()
          .value(function(d) { return d.price; })   // I need to give the vector of value
          .domain(vis.xScale.domain())  // then the domain of the graphic
          .thresholds(vis.xScale.ticks(70)); // then the numbers of bins

      // And apply this function to data to get the bins
      vis.bins = histogram(data);

      // Y axis: scale and draw:
      vis.yScale = d3.scaleLinear()
          .range([height, 0]);
          vis.yScale.domain([0, d3.max(bins, function(d) { return d.sy_pnum; })]);   // d3.hist has to be called before the Y axis obviously
      
      vis.yAxis = d3.axisLeft(vis.yScale)
          .ticks(5)
          .tickSizeOuter(0)
  
      vis.chart = vis.svg.append("g")
      .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

      // Append y-axis group 
      vis.yAxisG = vis.chart.append('g')
      .attr('class', 'axis y-axis');

      // append the bar rectangles to the svg element
      svg.selectAll("rect")
          .data(bins)
          .join("rect")
            .attr("x", 1)
        .attr("transform", function(d) { return `translate(${x(d.x0)} , ${y(d.sy_pnum)})`})
            .attr("width", function(d) { return x(d.x1) - x(d.x0) -1})
            .attr("height", function(d) { return height - y(d.length); })
            .style("fill", "#69b3a2")

      //this.renderVis();
    }
  
    /**
     * Prepare the data and scales before we render it.
     */
    updateVis() {
      let vis = this;
      
      
      vis.renderVis();
    }
  
    /**
     * Bind data to visual elements.
     */
    renderVis() {
      let vis = this;
      
      vis.svg.selectAll("rect")
      .data(bins)
      .join("rect")
        .attr("x", 1)
    .attr("transform", function(d) { return `translate(${x(d.x0)} , ${y(d.sy_pnum)})`})
        .attr("width", function(d) { return x(d.x1) - x(d.x0) -1})
        .attr("height", function(d) { return height - y(d.sy_pnum); })
        .style("fill", "#69b3a2")
      
    }
  }