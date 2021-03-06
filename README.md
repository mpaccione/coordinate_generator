# Coordinate Generator

## Two Methods of Generation

### Open Elevation API 

This coordinate generator takes two sets of Lattitude and Longitude (Y, X) coordinates and outputs Latitude, Longitude, Altitude (Y, X, Z) either as a CSV or JSON file.

It does this mathmatically and the output is always a square grid. The inputs need to be the Top Left and Bottom Right or Top Right and Bottom Left coordinate pairs.

You will need to customize the variables for your use case within app.js. It currently generates a 60KM^2 Y,X,Z grid as a placeholder.

I created this repo for the sole intent of creating my own terrain in my Everest Flight Simulator: https://github.com/mpaccione/everest_flight_sim

I had originally intended to use GE-Path http://www.sgrillo.net/googleearth/gepath.htm with Google Earth and pipe the output KML file into TCX Converter to obtain altitude data. https://tcx-converter.software.informer.com/2.0/

Unfortunately, upon creating my own CSV TCX Converter would not run it, so I have created my own solution.

Running the below code will generate four files:

```javascript
python api/elevation-srtm-coord/server.py

// Test the python server with this url 
// http://0.0.0.0:10000/api/v1/lookup?locations=10,10|20,20

node app.js
```

1. The coordinate output (`./coordinates/Coord_Data`). 
2. An info log of the generation settings. (`./coordinates/Data_Info`).

The data will then be sent to the Open Elevation API. 

3. The API output of X, Y, Z data (`./altitude/Coord_Output`)
4. An info log of the POST request (`./altitude/POST_Info`)

The coordinate elevation API is built in Python from this submodule, https://github.com/Developer66/open-elevation, which is a working version of the original open-elevation module

### Elevation - Python SRTM Generator

The altitude tif is created with a submodule of Elevation created in Python.

You will need a Linux + Python setup. Please follow the requirements found here on the original module page: https://pypi.org/project/elevation/

The elevation module creates a TIF file based upon SRTM (Shuttle Radar Topography Mission) data based on the request coordinates. See above docs.

You can then use the resulting TIF for data and relative 3D terrain uses like projecting into a canvas and sampling color data to create relative height units.

#### World SRTM
![World SRTM](https://github.com/mpaccione/coordinate_generator/blob/master/world-SRTM.png?raw=true)
#### Shuttle Radar Topography Mission
![SRTM Concept](https://github.com/mpaccione/coordinate_generator/blob/master/srtm-concept.jpg?raw=true)