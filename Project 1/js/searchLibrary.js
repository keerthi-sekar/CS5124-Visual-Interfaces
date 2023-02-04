function GenerateTable() {
	var files = document.getElementById('file_upload').files;
        if(files.length==0){
          alert("Please choose any file...");
          return;
        }
        var filename = files[0].name;
        var extension = filename.substring(filename.lastIndexOf(".")).toUpperCase();
        if (extension == '.CSV') {
            //Here calling another method to read CSV file into json
            csvFileToJSON(files[0]);
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
	var table=document.getElementById("display_csv_data");
        if(jsonData.length>0){
            var headers = Object.keys(jsonData[0]);
            var htmlHeader='<thead><tr>';
            const trueHeaders = ["pl_name", "discoverymethod", "disc_year" ,"pl_orbper", "sy_dist", "disc_facility"];
            const found = headers.some(r=> trueHeaders.includes(r))
            for(var i=0;i<headers.length;i++){
                if(headers[i] == trueHeaders)
                {
                    htmlHeader+= '<th>'+headers[i]+'</th>';
                }

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
