function tabulate(parentElement, data, columns) {
    var table = d3.select(parentElement)
        .attr("style", "margin-left: 10px");
    var thead = table.append("thead");
    var tbody = table.append("tbody");

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
            .html(function(d) {
                if(d.column == "More"){
                    return "<button type='button' class='use-address'>More</button>";
                }
                return d.value; 
            })
            .attr("style", "font-family: Inconsolata");
    
    return table;
}
//tabulate(data, ['pl_name', 'disc_year', 'st_spectype', 'sy_dist', 'dist_facility'])