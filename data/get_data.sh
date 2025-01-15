#!/bin/bash

# REMOVE OLD
rm *.geojson
rm *.osm


# DOWNLOAD XML FROM OVERPASS
curl -o output.osm "https://overpass-api.de/api/map?bbox=108.3801,11.8800,108.5200,12.0100"


# CONVERT TO GEOJSON
osmtogeojson output.osm > all.geojson


# DROP NON-NUMERIC PART OF FEATURE ID SUCH AS "way/"
jq '
  .features[] |= (
    .id |= (sub("^(way|node|relation)/"; "") | tonumber)
  )
' all.geojson > filtered.geojson


# SPLIT GEOJSON BY LAYER

jq '
  .features
  | map(
      select(
        .properties.building != null
        and (.properties."building:architecture" != "french_colonial")
      )
    )
' filtered.geojson > boring_building0.geojson

jq '
  .features | map(
      select(.properties."building:architecture" == "french_colonial")
    )
' filtered.geojson > french_building0.geojson

jq '.features | map(select(.properties.highway!= null))' filtered.geojson > highway.geojson
jq '.features | map(select(.properties.natural == "water" and (.properties.name == "Hồ Xuân Hương" or .properties.name == "Hồ Tuyền Lâm" or .properties.name == "Hồ Chiến Thắng" or .properties.name == "Hồ Đa Thiện")))' filtered.geojson > lake0.geojson
jq '.features | map(select(.properties.waterway == "stream"))' filtered.geojson > river0.geojson
jq '.features | map(select(.properties.landuse == "grass" or .properties.leisure == "golf_course" or .properties.leisure == "park"))' filtered.geojson > grass0.geojson


# REMOVE UNUSED FEATURE PROPERTIES (HIGHWAYS UNTOUCHED HERE SO FAR NOT TO BREAK STYLE FILTERS)

jq 'map({type: .type, geometry: .geometry, id: .id, properties: {name: .properties.name}})' boring_building0.geojson > boring_building.geojson
jq 'map({type: .type, geometry: .geometry, id: .id, properties: {name: .properties.name}})' french_building0.geojson > french_building.geojson
jq 'map({type: .type, geometry: .geometry, id: .id, properties: {name: .properties.name}})' lake0.geojson > lake.geojson
jq 'map({type: .type, geometry: .geometry, id: .id, properties: {name: .properties.name}})' river0.geojson > river.geojson
jq 'map({type: .type, geometry: .geometry, id: .id, properties: {name: .properties.name}})' grass0.geojson > grass.geojson


# MAKE MANY LAYERS FROM MANY JSON FILES

tippecanoe -e ../dalat-map-tiles/tiles \
--minimum-zoom=10 --maximum-zoom=17 \
--no-tile-compression -f \
boring_building.geojson french_building.geojson highway.geojson \
lake.geojson river.geojson grass.geojson



node save_bldgs_centroids.js