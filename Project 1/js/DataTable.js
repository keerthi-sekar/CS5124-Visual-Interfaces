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
        .append("tr")
            //.attr("id", "nr" + this.rowIndex);

    // create a cell in each row for each column
    let row_data;
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                row_data = row;
                return {column: column, value: row[column]};
            });
        })
        .enter()
        .append("td")
            .html(function(d) {
                if(d.column == "More"){
                    return `<button type="button" class="use-address">More</button>`;
                }

                return d.value; 
            })
            .attr("id", "nr")
            .attr("style", "font-family: Inconsolata")
    
    return table;
}

function Infographic(dataTable)
{
    //console.log(dataTable);
    alert(document.getElementById("tabledirectory").rows[3].cells.value);
    //base_table = tabulate("#tabledirectory", dataTable, ['Planet Name', 'Discovery Year', 'Spectral Type', 'Distance', 'Facility', 'More']);
}

function SampleData(btype)
{
    var objA = {
        'Planet Name': 'HAT-P-57 b',
        'Discovery Year': '2015',
        'Spectral Type': 'A',
        'Distance': '279.86',
        'Facility': 'HATnet'
    }

    var objF = {
        'Planet Name': 'HD 217786 c',
        'Discovery Year': '2022',
        'Spectral Type': 'F',
        'Distance': 55.48,
        'Facility': 'Multiple Observatories'
    }

    var objG = {
        'Planet Name': 'HD 155918 b',
        'Discovery Year': 'Radial Velocity',
        'Spectral Type': "G",
        'Distance': 27.56,
        'Facility': 'Multiple Observatories'
    }

    var plName = document.getElementById("planetName");
    var discYear = document.getElementById("discYear");
    var sType = document.getElementById("sType");
    var dist = document.getElementById("dist");
    var facility = document.getElementById("facilityText");
    var sVisual = document.getElementById("sVisual");

    if (btype == 'A')
    {
        plName.textContent = objA["Planet Name"];
        discYear.textContent = objA["Discovery Year"];
        sType.textContent = objA["Spectral Type"];
        dist.textContent = objA["Distance"];
        facility.textContent = objA["Facility"];
        sVisual.style.fill = 'blue';
    }
    else if(btype == 'F')
    {
        plName.textContent = objF["Planet Name"];
        discYear.textContent = objF["Discovery Year"];
        sType.textContent = objF["Spectral Type"];
        dist.textContent = objF["Distance"];
        facility.textContent = objF["Facility"];
        sVisual.style.fill = 'grey';
    }
    else if (btype == 'G')
    {
        plName.textContent = objG["Planet Name"];
        discYear.textContent = objG["Discovery Year"];
        sType.textContent = objG["Spectral Type"];
        dist.textContent = objG["Distance"];
        facility.textContent = objG["Facility"];
        sVisual.style.fill = 'yellow';
    }
}