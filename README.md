# Coordinate Generator

This coordinate generator takes two sets of Lattitude and Longitude (Y, X) coordinates and outputs Latitude, Longitude, Altitude (Y, X, Z) either as a CSV or JSON file.

It does this mathmatically and the output is always a square grid. The inputs need to be the Top Left and Bottom Right or Top Right and Bottom Left coordinate pairs.

You will need to customize the variables for your use case within app.js. It currently generates a 60KM^2 Y,X,Z grid as a placeholder.

I created this repo for the sole intent of creating my own terrain in my Everest Flight Simulator: https://github.com/mpaccione/everest_flight_sim

I had originally intended to use GE-Path http://www.sgrillo.net/googleearth/gepath.htm with Google Earth and pipe the output KML file into TCX Converter to obtain altitude data. https://tcx-converter.software.informer.com/2.0/

Unfortunately, upon creating my own CSV TCX Converter would not run it, so I have created my own solution.

The altitude data is created with a submodule of Open Elevation: https://github.com/Jorl17/open-elevation/blob/master/docs/host-your-own.md

The elevation api downloads an SRTM (Shuttle Radar Topography Mission) data of the entire world. The file size of this data is LARGE... potentially 20GB. Be advised.

![World SRTM](https://github.com/mpaccione/coordinate_generator/world-SRTM.png?raw=true)

![SRTM Concept](https://github.com/mpaccione/coordinate_generator/srtm-concept.jpg?raw=true)