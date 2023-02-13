console.log("Hello world");

let barchartA, barchartB, barchartC, barchartD, barchartE, scatterplotA, linechartA, histogramA, data;
//pl_name,hostname,sys_name,sy_snum,sy_pnum,discoverymethod,disc_year,pl_orbsmax,pl_rade,pl_bmasse,pl_orbeccen,st_spectype,st_rad,st_mass,sy_dist,disc_facility
d3.csv('data/cleaned-exoplanets.csv', d3.autoType)
	.then(_data => {
		data = _data;

		data.forEach(d => {
			d.pl_name = d.pl_name;
			d.hostname = d.hostname;
			d.sys_name = d.sys_name;
			d.sy_snum = +d.sy_snum;
			d.sy_pnum = +d.sy_pnum;
			d.discoverymethod = d.discoverymethod;
			d.disc_year = +d.disc_year;
			d.pl_orbsmax = +d.pl_orbsmax;
			d.pl_rade = +d.pl_rade;
			d.pl_bmasse = +d.pl_bmasse;
			d.pl_orbecce = +d.pl_orbecce;
			d.st_spectype = d.st_spectype;
			d.st_rad = +d.st_rad;
			d.st_mass = +d.st_mass;
			d.sy_dist = +d.sy_dist;
			d.disc_facility = d.disc_facility;
		});
		console.log(data);

		//data = data.sort(function (a,b) {return d3.ascending(a.discoverymethod, b.discoverymethod);});
		data = data.sort(function (a,b) {return d3.ascending(a.sy_snum, b.sy_snum);});
		data = data.sort(function (a,b) {return d3.ascending(a.sy_pnum, b.sy_pnum);});
		data = data.sort(function (a,b) {return d3.ascending(a.sy_dist, b.sy_dist);});
		data = data.sort(function (a,b) {return d3.ascending(a.disc_year, b.disc_year);});

		var snum_map = d3.rollups(data, v => v.length, d => d.sy_snum);
		var pnum_map = d3.rollups(data, v => v.length, d => d.sy_pnum);
		var dist_map = d3.rollups(data, v => v.length, d => d.sy_dist);
		var discmethod_map = d3.rollups(data, v => v.length, d => d.discoverymethod);

		barchartA = new Barchart({
			parentElement: '#barchartA',
			xAxisTitle: 'Star Count'
		  }, data, snum_map);
		
		barchartA.updateVis();

		barchartB = new Barchart({
			parentElement: '#barchartB',
			xAxisTitle: 'Planet Count'
		  }, data, pnum_map);

		barchartB.updateVis();

		barchartC = new Barchart({
			parentElement: '#barchartC',
			xAxisTitle: 'Star Type'
		  }, data, pnum_map);

		barchartC.updateVis();

		barchartD = new Barchart({
			parentElement: '#barchartD',
			containerWidth: 1000,
			containerHeight: 400,
			xAxisTitle: 'Discovery Method'
		  }, data, discmethod_map);

		barchartD.updateVis();

		barchartE = new Barchart({
			parentElement: '#barchartE',
			xAxisTitle: 'Zones'
		  }, data, pnum_map);

		barchartE.updateVis();

		scatterplotA = new Scatterplot({
			parentElement: '#scatterplotA'
		}, data);

		scatterplotA.updateVis();

		linechartA = new LineChart({
			parentElement: '#linechartA'
		}, data);

		linechartA.updateVis();

		

	})
	.catch(error => console.error(error));

d3.select('#sorting').on('click', d => {
	barchartA.config.reverseOrder = true;
	barchartA.updateVis();
})

d3.select('#start-year-input').on('change', function() {
	// Get selected year
	const minYear = parseInt(d3.select(this).property('value'));
  
	// Filter dataset accordingly
	let filteredData = data.filter(d => d.disc_year >= minYear);
  
	// Update chart
	linechartA.data = filteredData;
	linechartA.updateVis();
});

function sortByDateAscending(a,b){
	return a.disc_year - b.disc_year;
}

function GenerateTable() {
	var filename = 'clean-exoplanets.csv';
	var extension = filename.substring(filename.lastIndexOf(".")).toUpperCase();
	if (extension == '.CSV') {
		//Here calling another method to read CSV file into json
		csvFileToJSON(filename);
	}else{
		alert("Please select a valid csv file.");
	}
  }

function csvFileToJSON(file){
	try {
	  var reader = new FileReader();
	  reader.readAsBinaryString(file);
	  reader.onload = function(e) {
		  var jsonData = [];
		  var headers = [];
		  var rows = e.target.result.split("\r\n");               
		  for (var i = 0; i < rows.length; i++) {
			  var cells = rows[i].split(",");
			  var rowData = {};
			  for(var j=0;j<cells.length;j++){
				  if(i==0){
					  var headerName = cells[j].trim();
					  headers.push(headerName);
				  }else{
					  var key = headers[j];
					  if(key){
						  rowData[key] = cells[j].trim();
					  }
				  }
			  }
			   
			  if(i!=0){
				  jsonData.push(rowData);
			  }
		  }
			
		  //displaying the json result into HTML table
		  displayJsonToHtmlTable(jsonData);
		  }
	  }catch(e){
		  console.error(e);
	  }
}

function displayJsonToHtmlTable(jsonData)
{
	console.log("populate");
	var table=document.getElementById("display_data");
        if(jsonData.length>0){
            var headers = Object.keys(jsonData[0]);
            var htmlHeader='<thead><tr>';
             
            for(var i=0;i<headers.length;i++){
                htmlHeader+= '<th>'+headers[i]+'</th>';
            }
            htmlHeader+= '<tr></thead>';
             
            var htmlBody = '<tbody>';
            for(var i=0;i<jsonData.length;i++){
                var row=jsonData[i];
                htmlBody+='<tr>';
                for(var j=0;j<headers.length;j++){
                    var key = headers[j];
                    htmlBody+='<td>'+row[key]+'</td>';
                }
                htmlBody+='</tr>';
            }
            htmlBody+='</tbody>';
            table.innerHTML=htmlHeader+htmlBody;
        }else{
            table.innerHTML='There is no data in CSV';
        }
}