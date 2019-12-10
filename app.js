///////////////////////////////////////////
// Script for Outputing Coordinate Grids //
///////////////////////////////////////////

// Modules
const Agent = require('agentkeepalive'),
	  fs    = require('fs'),
	  http  = require('http'), 
	  path  = require('path');


// Placeholder Data is Mt.Everest


// [LAT, LONG, ALT] => [y, x, 0]
const area		= 3600, // 60 x 60, 60KM^2
	  coordArr  = [
					[86.622876, 28.084160], // Top Left Corner
					[87.230674, 27.680334]  // Bottom Right Corner
				  ],
	  direction = "column", // or Row
	  diviser   = 600, // √(area) * 10 => (0.1KM Points)
	  name 		= "Everest",
	  system    = "km",
	  type 		= "json"; // or "json"


// Runtime
// outputCoordinateArr(coordArr, direction, diviser, system, type);
gridDebugger("Grid_Output_Everest_60_1575574389046.json_Everest_1575574389046.json");


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

	fs.writeFile(path.join(__dirname, `/${directory}/Coord_Data_${name}_${timestamp}.${type}`), dataFixed, (err) => {
		err 
		? console.warn(err) 
		: fs.writeFile(path.join(__dirname, `/${directory}/Data_Info_${name}_${timestamp}.json`), JSON.stringify(log), (err) => {
			if (err) {
				console.warn(err);
			} else {
				console.log("LAT, LONG, File Write Successful");
				if (type == "json") {
					getElevationData(data, timestamp);
				}
			}
		  })
	})
}

function writeToFile2(data, directory1, directory2, log, type, timestamp, message){
	fs.writeFile(path.join(__dirname, `${directory1}_${name}_${timestamp}.${type}`), data, (err) => {
		err 
		? console.warn(err) 
		: fs.writeFile(path.join(__dirname, `${directory2}_${name}_${timestamp}.json`), JSON.stringify(log), (err) => {
			if (err) {
				console.warn(err);
			} else {
				console.log(message);
			}
		  })
	})
}

function gridDebugger(fileName){
	fs.readFile(path.join(__dirname, `/grid/${fileName}`), "utf8", (err, fileData) => {
		err ? console.warn(err) : (function(){
			const GRID_SIZE = 60;
			const SUBGRID_SIZE = 10;
			const data = JSON.parse(fileData);

			console.log(data);
			console.log(data.length)

			let grid = new Array(GRID_SIZE).fill(new Array(GRID_SIZE));

			//LOOP OVER EVERY GRID SQUARE
			for (let j = 0; j < GRID_SIZE; j++){
				for(let i = 0; i < GRID_SIZE; i++){
					//FOR EACH SQUARE IN GRID
					grid[i][j] = new Array(SUBGRID_SIZE).fill(new Array(SUBGRID_SIZE))
					//MAKE SUBGRID
					for(let z = 0; z < SUBGRID_SIZE; z++){
						for(let y = 0; y < SUBGRID_SIZE; y++){
							//EACH SQUARE IN SUBGRID
							const offset = ((i * 10) + y) + (600 * ((10 * j) + z))
							// grid[i][j][y][z] = data["results"][offset];
							// console.log({j, i, y, z, offset});
							// console.log(offset);
							// console.log(data[offset]);
							//console.log(data[offset].longitude);
							//console.log(JSON.stringify(grid))
						}
					}
				}
			}
			
		})(fileData)
	})
}

function writeToFile3(data, timestamp){
	console.log('writeToFile3');
	const GRID_SIZE = 60;
	const SUBGRID_SIZE = 10;

	let grid = new Array(GRID_SIZE).fill(new Array(GRID_SIZE));

		//LOOP OVER EVERY GRID SQUARE
		for (let j = 0; j < GRID_SIZE; j++){
			for(let i = 0; i < GRID_SIZE; i++){
				//FOR EACH SQUARE IN GRID
					//TODO			
				grid[i][j] = new Array(SUBGRID_SIZE).fill(new Array(SUBGRID_SIZE))
				//MAKE SUBGRID
				for(let z = 0; z < SUBGRID_SIZE; z++){
					for(let y = 0; y < SUBGRID_SIZE; y++){
						//EACH SQUARE IN SUBGRID
						const offset = ((i * 10) + y) + (600 * ((10 * j) + z))
						grid[i][j][y][z] = data["results"][offset];
						//grid[j][i][z][y] = {j, i, y, z, offset};
						//console.log(JSON.stringify(grid))
					}
				}
			}
		}
		//console.log(JSON.stringify(grid))
		// writeToFile2(JSON.stringify(grid), `/grid/Grid_Output_${name}_${GRID_SIZE}_${timestamp}.json`, `/grid/Grid_Info_${name}_${GRID_SIZE}_${timestamp}.json`, {"gridSize": GRID_SIZE, "subgridSize": SUBGRID_SIZE}, 'json', timestamp, "Grid File Write Successful");

}


function getElevationData(data, timestamp){
	const keepaliveAgent = new Agent({
		  	maxSockets: 100,
		  	maxFreeSockets: 10,
  			timeout: 480000, // active socket keepalive for 4 minutes
  	   		freeSocketTimeout: 120000, // free socket keepalive for 60 seconds
		  }),
		  postObj = JSON.stringify({ locations: data }), 
		  options = {
		  	agent: keepaliveAgent,
			hostname: '0.0.0.0',
			port: '10000',
			path: '/api/v1/lookup',
			method: 'POST',
			headers: {
		      'Accept': 'application/json',
		      'Content-Type': 'application/json',
		      'Content-Length': Buffer.byteLength(postObj)
		    }
		  },
		  req = http.request(options, (res) => {
					console.log(`statusCode: ${res.statusCode}`);
					const timestamp = new Date().getTime();
					let result;

					res.on('data', (d) => {
						result += d;
					})

					res.on('end', () => {
						const resultFixed = result.substring(9, result.length);
						console.log(resultFixed);
						writeToFile2(resultFixed, `/altitude/Coord_Output_${name}_${timestamp}.json`, `/altitude/POST_Info_${name}_${timestamp}.json`, options, 'json', timestamp, "LAT, LONG, ALT, File Write Successful");
						writeToFile3(JSON.parse(resultFixed), timestamp);
					})

					res.on('error', (error) => {
						console.log('res error');
						console.error(error);
					})
				});

	req.on('error', (error) => {
		console.log('req error');
		console.error(error);
	})

	req.write(postObj);
	req.end();

	setTimeout(() => {
	  if (keepaliveAgent.statusChanged) {
	    console.log('[%s] agent status changed: %j', Date(), keepaliveAgent.getCurrentStatus());
	  }
	}, 2000);

}