///////////////////////////////////////////
// Script for Outputing Coordinate Grids //
///////////////////////////////////////////

// Placeholder Data is Mt.Everest

// [LONG, LAT] => [x, y]
const area		= 3600, // 60 x 60, 60KM^2
	  coordArr  = [
					[87.230674, 27.680334], // Top Left Corner
					[86.622876, 28.084160]  // Bottom Right Corner
				  ],
	  direction = "column", // or Row
	  diviser   = 600, // √(area) * 10 => (0.1KM Points)
	  system    = "km";

// Runtime
outputCoordinateArr(coordArr, direction, diviser, system);

// Function
function outputCoordinateArr(coordArr, direction, diviser, system){
	const longStart = (coordArr[0][0] - coordArr[1][0]) > 0 ? coordArr[0][0] : coordArr[0][1],
		  latStart  = (coordArr[1][0] - coordArr[1][1]) > 0 ? coordArr[0][0] : coordArr[0][1], 
		  longDiff  = Math.abs(coordArr[0][0] - coordArr[1][0]),
		  latDiff   = Math.abs(coordArr[0][1] - coordArr[1][1]),
		  longIncr  = longDiff / diviser,
		  latIncr   = latDiff / diviser;

	let latArr    = [],
		longArr   = [],
		resultArr = [];

	// populate result array
	for (var a = 0; a < diviser; a++) {
		for (var b = 0; b < diviser; b++) {
			let x = longStart + (b * longIncr),
				y = latStart + (a * latIncr);

			direction == "column" ? resultArr.push([x,y]) : resultArr.push([y,x]);
		}
	}

	console.log({
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
	})

	console.log('resultArr');
	console.log(resultArr);

	return resultArr;
}