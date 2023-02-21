function tabulate(data, columns) {
	console.log("tabulate");
    var table = d3.select("SourceData").append("table")
            //.attr("style", "margin-left: 250px"),
        thead = table.append("thead");
        tbody = table.append("tbody");

    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
            .text(function(column) { return column; });

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return {column: column, value: row[column]};
            });
        })
        .enter()
        .append("td")
        .attr("style", "font-family: Courier")
            .html(function(d) { return d.value; });
    
    return table;
}
//tabulate(data, ['pl_name', 'disc_year', 'st_spectype', 'sy_dist', 'dist_facility'])