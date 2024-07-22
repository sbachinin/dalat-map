#!/bin/bash

# REMOVE OLD
rm *.geojson
rm *.osm

# DOWNLOAD XML FROM OVERPASS
curl -o output.osm "https://overpass-api.de/api/map?bbox=108.3801,11.8800,108.5200,12.0100"

# CONVERT TO GEOJSON
osmtogeojson output.osm > all.geojson

# REMOVE UNUSED FEATURE PROPERTIES
jq '.features |= map(del(.properties.timestamp, .properties.version, .properties.user, .properties.changeset, .properties.note, .properties.uid, .properties.id, .properties.source, .properties.layer, .properties.surface))' all.geojson > filtered.geojson

# SPLIT GEOJSON BY LAYER

jq '.features | map(select(.properties.building != null))' filtered.geojson > building.geojson
jq '.features | map(select(.properties.highway!= null))' filtered.geojson > highway.geojson
jq '.features | map(select(.properties.natural == "water"))' filtered.geojson > water.geojson
jq '.features | map(select(.properties.waterway == "stream"))' filtered.geojson > river.geojson
jq '.features | map(select(.properties.landuse == "grass" or .properties.leisure == "golf_course" or .properties.leisure == "park"))' filtered.geojson > grass.geojson

# MAKE MANY LAYERS FROM MANY JSON FILES

tippecanoe -e ../tiles \
--minimum-zoom=10 --maximum-zoom=17 \
--no-tile-compression -f \
building.geojson highway.geojson \
water.geojson river.geojson grass.geojson