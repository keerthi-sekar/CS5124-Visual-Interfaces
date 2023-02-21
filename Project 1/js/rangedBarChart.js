class RangedBarChart {

    /**
     * Class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data, _map) {
        // Configuration object with defaults
        this.config = {
        parentElement: _config.parentElement,
        containerWidth: _config.containerWidth || 400,
        containerHeight: _config.containerHeight || 250,
        margin: _config.margin || {top: 10, right: 20, bottom: 20, left: 40},
        reverseOrder: _config.reverseOrder || false,
        tooltipPadding: _config.tooltipPadding || 15,
        xAxisTitle: _config.xAxisTitle || 'Start Count',
        yAxisTitle: _config.yAxisTitle || 'Exoplanets',
        }
        this.data = _data;
        this.num_map = _map;
        this.initVis();
    }
    
    /**
     * Initialize scales/axes and append static elements, such as axis titles
     */
    initVis() {
        let vis = this;
    
        // Calculate inner chart size. Margin specifies the space around the actual chart.
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
        
        // Important: we flip array elements in the y output range to position the rectangles correctly
        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0]) 
    
        vis.xScale = d3.scaleBand()
            //.domain(this.num_map)
            .range([0, vis.width])
            .paddingInner(0.2);
    
        vis.xAxis = d3.axisBottom(vis.xScale)
            .ticks(data)
            .tickSizeOuter(0);
    
        vis.yAxis = d3.axisLeft(vis.yScale)
            .ticks(10)
            .tickSizeOuter(0)
    
        // Define size of SVG drawing area
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);
    
        // SVG Group containing the actual chart; D3 margin convention
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
            
        vis.xScale.domain(data.map(function(d) { return d.st_spectype; }));
        vis.yScale.domain([0, d3.max(data, function(d) { return d.sy_pnum; })]);
    
        // Append empty x-axis group and move it to the bottom of the chart
        vis.xAxisG = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.height})`);
    
        // Append y-axis group 
        vis.yAxisG = vis.chart.append('g')
            .attr('class', 'axis y-axis');
    
        // Append axis title
        vis.chart.append('text')
            .attr('class', 'axis-title')
            .attr('x', -10)
            .attr('y', -10)
            .attr('dy', '.71em')
            .text(vis.config.yAxisTitle);
    
        vis.chart.append('text') //x-axis = radius [dist]
        .attr('class', 'axis-title')
        .attr('y', vis.height + 25)
        .attr('x', vis.width + 5)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text(vis.config.xAxisTitle);
    }
    
    /**
     * Prepare data and scales before we render it
     */
    updateVis() {
        let vis = this;
    
        if (vis.config.reverseOrder) {
        vis.data.reverse();
        }
    
        /*
		Habitable vs UnHabitable:
		pl_orbsmax
		A - inner =  8.5 AU, outer = 12.5 AU
		F - inner = 1.5 AU, outer = 2.2 AU
		G - inner = 0.95 AU, outer = 1.4 AU
		K - inner = 0.38 AU, outer = 0.56 AU
		M - inner = 0.08 AU, outer = 0.12 AU
	    */

        const inner_ranges = new Map()
        const outer_ranges = new Map()
        const habitable = new Map()

        inner_ranges.set('A', 8.5);
        inner_ranges.set('F', 1.5);
        inner_ranges.set('G', 0.95);
        inner_ranges.set('K', 0.38);
        inner_ranges.set('M', 0.08);

        outer_ranges.set('A', 12.5);
        outer_ranges.set('F', 2.2);
        outer_ranges.set('G', 1.4);
        outer_ranges.set('K', 0.56);
        outer_ranges.set('M', 0.12);

        for(let [key, value] of vis.num_map)
        {
            if(key == inner_ranges.key)
            {
                if(value >= inner_ranges[key].value && value <= outer_ranges[key].value)
                {
                    console.log("Habitable" + value);
                    habitable.set(key, 'Habitable');
                }
                else if (value < inner_ranges[key].value && value > outer_ranges[key].value)
                {
                    habitable.set(key, 'UnHabitable');
                }
            }
        }

        vis.aggregatedData = Array.from(habitable, ([key, count]) => ({ key, count }));
    
        /*const orderedKeys = ['0','1','2','3', '4'];
        vis.aggregatedData = vis.aggregatedData.sort((a,b) => {
        return orderedKeys.indexOf(a.key) - orderedKeys.indexOf(b.key);
        });*/
    
        // Specificy accessor functions
        vis.xValue = d => d.key;
        vis.yValue = d => d.count;
    
        // Set the scale input domains
        vis.xScale.domain(vis.aggregatedData.map(vis.xValue));
        vis.yScale.domain([0, d3.max(vis.aggregatedData, vis.yValue)]);
    
        vis.renderVis();
    }
    
    /**
     * Bind data to visual elements
     */
    renderVis() {
        let vis = this;
    
        // Add rectangles
        const bars = vis.chart.selectAll('.bar')
            .data(vis.aggregatedData, vis.xValue)
        .join('rect')
            .attr('class', 'bar')
            .attr('x', d => vis.xScale(vis.xValue(d)))
            .attr('width', vis.xScale.bandwidth())
            .attr('height', d => vis.height - vis.yScale(vis.yValue(d)))
            .attr('y', d => vis.yScale(vis.yValue(d)))
            .attr('fill', '#023020')
        bars
        .on('mouseover', (event,d) => {
            d3.select('#tooltip')
            .style('display', 'block')
            .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
            .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
            .html(`
                <div class="tooltip-title">${vis.config.xAxisTitle}: ${d.key}</div>
                <div><i>Exoplanets: ${d.count}</i></div>
            `);
        })
        .on('mouseleave', () => {
            d3.select('#tooltip').style('display', 'none');
        });
        // Update axes
        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);
    }
    }