class DataTable {

    /**
     * Class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data) {
      // Configuration object with defaults
      this.config = {
        parentElement: _config.parentElement,
        containerWidth: _config.containerWidth || 400,
        containerHeight: _config.containerHeight || 250,
        margin: _config.margin || {top: 10, right: 10, bottom: 40, left: 40},
        reverseOrder: _config.reverseOrder || false,
        tooltipPadding: _config.tooltipPadding || 15,
      }
      this.data = _data;
      this.initVis();
    }

    initVis() {
        let vis = this;
    
        // Calculate inner chart size. Margin specifies the space around the actual chart.
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        var table = d3.select(parentElement).append('table');

        var tr = table.selectAll('tr')
            .data(data).enter()
            .append('tr');

        tr.append('td').html(function(m) { return m.pl_name; });
        tr.append('td').html(function(m) { return m.hostname; });
        tr.append('td').html(function(m) { return m.disc_year; });
        tr.append('td').html(function(m) { return m.discoverymethod; });
        tr.append('td').html(function(m) { return m.pl_rade; });
        tr.append('td').html(function(m) { return m.pl_bmasse; });
    }
}