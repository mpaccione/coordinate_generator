///////////////////////////////////////////
// Script for Outputing Coordinate Grids //
///////////////////////////////////////////

// Modules
const fetch = require('isomorphic-fetch'), 
	  fs    = require('fs'),
	  path  = require('path');


// Placeholder Data is Mt.Everest


// [LAT, LONG, ALT] => [y, x, 0]
const area		= 3600, // 60 x 60, 60KM^2
	  coordArr  = [
					[87.230674, 27.680334], // Top Left Corner
					[86.622876, 28.084160]  // Bottom Right Corner
				  ],
	  direction = "column", // or Row
	  diviser   = 600, // √(area) * 10 => (0.1KM Points)
	  system    = "km",
	  type 		= "json"; // or "json"


// Runtime
outputCoordinateArr(coordArr, direction, diviser, system, type);


// Functions
function outputCoordinateArr(coordArr, direction, diviser, system){
	const longStart = (coordArr[0][0] - coordArr[1][0]) > 0 ? coordArr[0][0] : coordArr[1][0],
		  latStart  = (coordArr[1][0] - coordArr[1][1]) > 0 ? coordArr[0][1] : coordArr[1][1], 
		  longDiff  = Math.abs(coordArr[0][0] - coordArr[1][0]),
		  latDiff   = Math.abs(coordArr[0][1] - coordArr[1][1]),
		  longIncr  = longDiff / diviser,
		  latIncr   = latDiff / diviser,
		  resultArr = [];
	let   resultTxt;

	// populate result array
	for (var a = 0; a < diviser; a++) {
		for (var b = 0; b < diviser; b++) {
			const x = direction == "column" ? longStart + (b * longIncr) : longStart + (a * longIncr),
				  y = direction == "column" ? latStart + (a * latIncr) : latStart + (b * latStart);

			type == "csv" ? resultArr.push([y, x, 0]) : resultArr.push({"latitude": y, "longitude": x});
		}
	}

	const log = {
		"coordArr" : coordArr,
		"direction": direction,
		"diviser"  : diviser,
		"system"   : system,
		"longStart": longStart,
		"longDiff" : longDiff,
		"longIncr" : longIncr,
		"latStart" : latStart,
		"latDiff"  : latDiff,
		"latIncr"  : latIncr
	};

	writeToFile(resultArr, direction, "coordinates", log, type);
}


function writeToFile(data, direction, directory, log, type){
	const timestamp = new Date().getTime();
	let   dataFixed;

	dataFixed = type == "csv" ? "LAT,LONG,ALT\n"+data.map(e => e.join(",")).join("\n") : JSON.stringify(data);

	fs.writeFile(path.join(__dirname, `/${directory}/Coord_Data_${timestamp}.${type}`), dataFixed, (err) => {
		err 
		? console.warn(err) 
		: fs.writeFile(path.join(__dirname, `/${directory}/Data_Info_${timestamp}.json`), JSON.stringify(log), (err) => {
			if (err) {
				console.warn(err);
			} else {
				console.log("File Write Successful");
				if (type == "json") {
					getElevationData(data, timestamp);
				}
			}
		  })
	})
}

function writeToFile2(data, directory, log, type){
	const timestamp = new Date().getTime();

	fs.writeFile(path.join(__dirname, `/${directory}/Coord_Data_${timestamp}.${type}`), data, (err) => {
		err 
		? console.warn(err) 
		: fs.writeFile(path.join(__dirname, `/${directory}/Data_Info_${timestamp}.json`), JSON.stringify(log), (err) => {
			if (err) {
				console.warn(err);
			} else {
				console.log("File Write Successful");
				if (type == "json") {
					getElevationData(data, timestamp);
				}
			}
		  })
	})
}



function getElevationData(data, timestamp){

	const log = {
		"url": 'https://api.open-elevation.com/api/v1/lookup',
		headers: {
	      'Accept': 'application/json',
	      'Content-Type': 'application/json'
	    },
	    method: "POST",
	    body: `See Coord_Data_${timestamp}.json in /coordinates/`	
	}

	fetch('https://api.open-elevation.com/api/v1/lookup', {
		headers: {
	      'Accept': 'application/json',
	      'Content-Type': 'application/json'
	    },
	    method: "POST",
	    body: JSON.stringify({ locations: data })
	}).then(response => response.json()).then(result => { writeToFile2(result, 'altitude', log, 'json') }).catch(err => console.warn(err))

}