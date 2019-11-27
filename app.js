///////////////////////////////////////////
// Script for Outputing Coordinate Grids //
///////////////////////////////////////////

// Modules
const fs   = require('fs'),
	  path = require('path');


// Placeholder Data is Mt.Everest


// [LONG, LAT] => [x, y]
const area		= 3600, // 60 x 60, 60KM^2
	  coordArr  = [
					[87.230674, 27.680334], // Top Left Corner
					[86.622876, 28.084160]  // Bottom Right Corner
				  ],
	  direction = "column", // or Row
	  diviser   = 600, // √(area) * 10 => (0.1KM Points)
	  system    = "km",
	  type 		= "csv"; // or "json"


// Runtime
outputCoordinateArr(coordArr, direction, diviser, system);


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

			type == "json" ? resultTxt += `${x},${y}` : resultArr.push([x,y]);
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

	type == "json" ? writeToFile(resultTxt, log) : writeToFile(resultArr, log);
}


function writeToFile(data, log){
	const timestamp = new Date().getTime();

	fs.writeFile(path.join(__dirname, `/output/Coord_Data_${timestamp}.${type}`), data, (err) => {
		err 
		? console.warn(err) 
		: fs.writeFile(path.join(__dirname, `/output/Data_Info_${timestamp}.json`), JSON.stringify(log), (err) => {
			err ? console.warn(err) : console.log("File Write Successful");
		  })
	})
}