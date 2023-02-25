console.log("Hello world");

let barchartA, barchartB, barchartC, barchartD, barchartE, scatterplotA, linechartA, histogramA, data;

let dataTable = [];

let zone_map = new Map();
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
			//d.pl_orbecce = d.pl_orbecce;
			d.st_spectype = d.st_spectype.charAt(0);
			d.st_rad = +d.st_rad;
			d.st_mass = +d.st_mass;
			d.sy_dist = +d.sy_dist;
			d.disc_facility = d.disc_facility;

			var obj = {
				'Planet Name': d.pl_name,
				'Discovery Year': d.discoverymethod,
				'Spectral Type': d.st_spectype,
				'Distance': Math.round(100*d.sy_dist)/100,
				'Facility': d.disc_facility
			}
			dataTable.push(obj);

		});
		console.log(data);
		console.log(dataTable);
		
		tabulate("#SourceData", dataTable, ['Planet Name', 'Discovery Year', 'Spectral Type', 'Distance', 'Facility']);
		tabulate("#tabledirectory", dataTable, ['Planet Name', 'Discovery Year', 'Spectral Type', 'Distance', 'Facility', 'More']);

		data = data.sort(function (a,b) {return d3.ascending(a.sy_snum, b.sy_snum);});
		data = data.sort(function (a,b) {return d3.ascending(a.sy_pnum, b.sy_pnum);});
		data = data.sort(function (a,b) {return d3.ascending(a.sy_dist, b.sy_dist);});
		data = data.sort(function (a,b) {return d3.ascending(a.disc_year, b.disc_year);});

		var snum_map = d3.rollups(data, v => v.length, d => d.sy_snum);
		var pnum_map = d3.rollups(data, v => v.length, d => d.sy_pnum);
		var dist_map = d3.rollups(data, v => v.length, d => d.sy_dist);
		var discmethod_map = d3.rollups(data, v => v.length, d => d.discoverymethod);
		var discoveries_map = d3.rollups(data, v => v.length, d => d.disc_year);
		var stype_map = d3.rollups(data, v => v.length, d => d.st_spectype);
		var spectype_groups = d3.group(data, d => d.st_spectype);
		
		console.log(spectype_groups);
		zone_map = GetHabitable(spectype_groups);

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
		  }, data, stype_map);

		barchartC.updateVis();

		barchartD = new Barchart({
			parentElement: '#barchartD',
			containerWidth: 1100,
			containerHeight: 400,
			xAxisTitle: 'Discovery Method'
		  }, data, discmethod_map);

		barchartD.updateVis();

		scatterplotA = new Scatterplot({
			parentElement: '#scatterplotA',
			containerHeight: 400
		}, data);

		scatterplotA.updateVis();

		linechartA = new LineChart({
			parentElement: '#linechartA'
		}, discoveries_map);

		linechartA.updateVis();

		histogramA = new Histogram({
			parentElement: '#histogramA',
		  }, data, dist_map);

		histogramA.updateVis();
		
		console.log(zone_map);

		barchartE = new Barchart({
			parentElement: '#barchartE',
			xAxisTitle: 'Zones'
		  }, data, zone_map);

		barchartE.updateVis(); 

	})
	.catch(error => console.error(error));

d3.select('#sorting').on('click', d => {
	barchartA.config.reverseOrder = true;
	barchartA.updateVis();
})

/* $(".use-address").click(function() {
    var $row = $(this).closest("tr");    // Find the row
    var $tds = $row.find("td");
    $.each($tds, function() {
        //console.log($(this).text());
		console.log('test');
    });
    
});

$(function DataOutput(rowArray)
{
	console.log("test");
}); */

function GetHabitable(spectype_groups)
{
	//var spectype_groups = d3.group(_data, d => d.st_spectype);
	var unhab = 0;
	var hab = 0;
	spectype_groups.forEach((value, key) =>
	{
		if(key == "A")
		{
			value.forEach(item => {
				if(item.pl_orbsmax >= 8.5 && item.pl_orbsmax < 12.5)
				{
					hab++;
				}
				else
				{
					unhab++;
				}
			})
		}
		else if(key == "F")
		{
			value.forEach(item => {
				if(item.pl_orbsmax >= 1.5 && item.pl_orbsmax < 2.2)
				{
					hab++;
				}
				else
				{
					unhab++;
				}
			})
		}
		else if(key == "G")
		{
			value.forEach(item => {
				if(item.pl_orbsmax >= 0.95 && item.pl_orbsmax < 1.4)
				{
					hab++;
				}
				else
				{
					unhab++;
				}
			})
		}
		else if(key == "K")
		{
			value.forEach(item => {
				if(item.pl_orbsmax >= 0.38 && item.pl_orbsmax < 0.56)
				{
					hab++;
				}
				else
				{
					unhab++;
				}
			})
		}
		else if(key == "F")
		{
			value.forEach(item => {
				if(item.pl_orbsmax >= 0.08 && item.pl_orbsmax < 0.12)
				{
					hab++;
				}
				else
				{
					unhab++;
				}
			})
		}

		const hab_map = new Map();

		hab_map.set("Habitable", hab);
		hab_map.set("Unhabitable", unhab);

		return hab_map;
	})

}
d3.select('#start-year-input').on('change', function() {
	// Get selected year
	const minYear = parseInt(d3.select(this).property('value'));
  
	// Filter dataset accordingly
	let filteredData = data.filter(d => d.disc_year >= minYear);
  
	// Update chart
	linechartA.data = filteredData;
	linechartA.updateVis();
});