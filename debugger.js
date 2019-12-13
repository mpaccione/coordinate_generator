 export function gridDebugger(fileName){
 	console.log("gridDebugger");
	fs.readFile(path.join(__dirname, `/grid/${fileName}`), "utf8", (err, fileData) => {
		err ? console.warn(err) : (function(){
			const GRID_SIZE = 60;
			const SUBGRID_SIZE = 10;
			const data = JSON.parse(fileData);

			// console.log(data['results']);
			// console.log(data['results'].length)

			let grid = new Array(GRID_SIZE).fill(new Array(GRID_SIZE));

			// LOOP OVER EVERY GRID SQUARE
			for (let j = 0; j < GRID_SIZE; j++){
				for (let k = 0; k < GRID_SIZE; k++){
					// FOR EACH SQUARE IN GRID
					grid[k][j] = new Array(SUBGRID_SIZE).fill(new Array(SUBGRID_SIZE))
					// MAKE SUBGRID
					for (let a = 0; a < SUBGRID_SIZE; a++){
						for (let b = 0; b < SUBGRID_SIZE; b++){
							// EACH SQUARE IN SUBGRID
							const offset = ((k * 10) + b) + (600 * ((10 * j) + a)),
								  obj = JSON.parse(JSON.stringify(data["results"][offset]));

							// console.log(offset);
							// console.log(obj);

							if (obj !== null && obj !== undefined && obj.constructor.name === "Object") {
								grid[k][j][b].push(obj);	
							}
							
							// console.log(data["results"][offset]);
							// console.log(data["results"][offset]["longitude"])
							// console.log(data["results"][offset]["latitude"])
							// console.log({j, k, b, a, offset});
							// console.log(offset);
							// console.log(data["results"][offset]);
							// console.log(data['results'][offset].longitude);
							// console.log(JSON.stringify(grid))
						}
					}
				}
			}

			console.log(JSON.stringify(grid));
			
		})(fileData)
	})
}