class LineChart {

    /**
     * Class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data) {
      this.config = {
        parentElement: _config.parentElement,
        containerWidth: _config.containerWidth || 550,
        containerHeight: _config.containerHeight || 300,
        margin: _config.margin || {top: 15, right: 15, bottom: 40, left: 40},
        tooltipPadding: _config.tooltipPadding || 15
      }
      this.data = _data;
      this.initVis();
    }
    
    /**
     * Initialize scales/axes and append static chart elements
     */
    initVis() {
      let vis = this;
  
      vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
      vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
  
      vis.xScale = d3.scaleTime()
          .domain(d3.extent(data, d => d.disc_year)).nice()
          .range([0, vis.width]);
  
      vis.yScale = d3.scaleLinear()
          .domain(d3.extent(data, d => d.sy_pnum)).nice()
          .range([vis.height, 0]);
  
      // Initialize axes
      vis.xAxis = d3.axisBottom(vis.xScale)
          .ticks(10)
          .tickSizeOuter(0)
          .tickPadding(10)
          .tickFormat(d3.timeFormat("%Y")); // <-- format
  
      vis.yAxis = d3.axisLeft(vis.yScale)
          .ticks(10)
          .tickSizeOuter(0)
          .tickPadding(10);
  
      // Define size of SVG drawing area
      vis.svg = d3.select(vis.config.parentElement)
          .attr('width', vis.config.containerWidth)
          .attr('height', vis.config.containerHeight);
  
      // Append group element that will contain our actual chart (see margin convention)
      vis.chart = vis.svg.append('g')
          .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
  
      // Append empty x-axis group and move it to the bottom of the chart
      vis.xAxisG = vis.chart.append('g')
          .attr('class', 'axis x-axis')
          .attr('transform', `translate(0,${vis.height})`)
          .call(d3.axisBottom(vis.xScale).ticks(vis.width / 80).tickSizeOuter(0));
      
      // Append y-axis group
      vis.yAxisG = vis.chart.append('g')
          .attr('class', 'axis y-axis')
          .call(d3.axisLeft(vis.yScale).ticks().tickFormat(d3.format('~s')))
          .call(g => g.select(".domain").remove())
          .call(g => g.append("text")
              .attr("x", 0)
              .attr("y", 10)
              .attr("fill", "currentColor")
              .attr("text-anchor", "start")
              .text(data.sy_pnum));
  
      // We need to make sure that the tracking area is on top of other chart elements
      vis.marks = vis.chart.append('g');
      vis.trackingArea = vis.chart.append('rect')
          .attr('width', vis.width)
          .attr('height', vis.height)
          .attr('fill', 'none')
          .attr('pointer-events', 'all');
  
          //(event,d) => {
  
      // Empty tooltip group (hidden by default)
      vis.tooltip = vis.chart.append('g')
          .attr('class', 'tooltip')
          .style('display', 'none');
  
      vis.tooltip.append('circle')
          .attr('r', 4);
  
      vis.tooltip.append('text');
    }
  
    /**
     * Prepare the data and scales before we render it.
     */
    updateVis() {
      let vis = this;
      
      vis.xValue = d => d.disc_year;
      vis.yValue = d => d.sy_pnum;
  
      vis.line = d3.line()
          .x(d => vis.xScale(vis.xValue(d)))
          .y(d => vis.yScale(vis.yValue(d)));
  
      // Set the scale input domains
      vis.xScale.domain(d3.extent(vis.data, vis.xValue));
      vis.yScale.domain(d3.extent(vis.data, vis.yValue));
  
      vis.bisectDate = d3.bisector(vis.xValue).left;
  
      vis.renderVis();
    }
  
    /**
     * Bind data to visual elements
     */
    renderVis() {
      let vis = this;
  
      // Add line path
      vis.marks.selectAll('.chart-line')
          .data([vis.data])
        .join('path')
          .attr('class', 'chart-line')
          .attr('d', vis.line)
          .attr('fill', '#023020');
  
      /* vis.trackingArea
        .on('mouseenter', () => {
            vis.tooltip.style('display', 'block');
        })
        .on('mouseleave', () => {
            vis.tooltip.style('display', 'none');
        })
        .on('mousemove', function(event) {
            // Get date that corresponds to current mouse x-coordinate
            const xPos = d3.pointer(event, this)[0]; // First array element is x, second is y
            const date = vis.xScale.invert(xPos);

            // Find nearest data point
            const index = vis.bisectDate(vis.data, date, 1);
            const a = vis.data[index - 1];
            const b = vis.data[index];
            const d = b && (date - a.date > b.date - date) ? b : a; 

            // Update tooltip
            vis.tooltip.select('circle')
                .attr('transform', `translate(${vis.xScale(d.disc_year)},${vis.yScale(d.sy_pnum)})`);
            
            vis.tooltip.select('text')
                .attr('transform', `translate(${vis.xScale(d.disc_year)},${(vis.yScale(d.sy_pnum) - 15)})`)
                .text(Math.round(d.sy_pnum));
        });  */
      
      // Update the axes
      vis.xAxisG.call(vis.xAxis);
      vis.yAxisG.call(vis.yAxis);
    }
  }