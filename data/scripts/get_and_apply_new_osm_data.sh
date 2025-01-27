#!/bin/bash

no_download=false
for arg in "$@"; do
  if [ "$arg" == "no-download" ]; then
    no_download=true
    break
  fi
done

# REMOVE OLD
rm ../temp/*.geojson

# DOWNLOAD XML FROM OVERPASS
if [ "$no_download" == false ]; then
  rm ../temp/*.osm
  curl -o ../temp/output.osm "https://overpass-api.de/api/map?bbox=108.3801,11.8800,108.5200,12.0100"
fi

# CONVERT TO GEOJSON
osmtogeojson ../temp/output.osm > ../temp/all.geojson

# DROP NON-NUMERIC PART OF FEATURE ID SUCH AS "way/"
jq '
  .features[] |= (
    .id |= (sub("^(way|node|relation)/"; "") | tonumber)
  )
' ../temp/all.geojson > ../temp/filtered.geojson










# SPLIT GEOJSON BY LAYER

jq '
  .features
  | map(
      select(
        .properties.building != null
        and (.properties."building:architecture" != "french_colonial")
      )
    )
' ../temp/filtered.geojson > ../temp/boring_building0.geojson

jq '
  .features | map(
    select(.properties."building:architecture" == "french_colonial")
  )
' ../temp/filtered.geojson > ../temp/french_building0.geojson

jq '
  .features | map(select(.properties.highway!= null))
' ../temp/filtered.geojson > ../temp/highway.geojson

jq '
  .features | map(
    select(.properties.natural == "water"
    and (
      .properties.name == "Hồ Xuân Hương"
      or .properties.name == "Hồ Tuyền Lâm" or .properties.name == "Hồ Chiến Thắng" or .properties.name == "Hồ Đa Thiện")
    )
  )
' ../temp/filtered.geojson > ../temp/lake0.geojson

jq '
  .features | map(
    select(.properties.waterway == "stream")
  )
' ../temp/filtered.geojson > ../temp/river0.geojson
jq '
  .features | map(
    select(
      .properties.landuse == "grass" 
      or .properties.leisure == "golf_course"
      or .properties.leisure == "park")
    )
' ../temp/filtered.geojson > ../temp/grass0.geojson








# TAKE ONLY REQUIRED FEATURE PROPERTIES (HIGHWAYS UNTOUCHED HERE SO FAR NOT TO BREAK STYLE FILTERS)
JQ_FILTER='map({
  type: .type,
  geometry: .geometry,
  id: .id,
  properties: {name: .properties.name}
})'
jq "$JQ_FILTER" ../temp/boring_building0.geojson > ../temp/boring_building.geojson
jq "$JQ_FILTER" ../temp/french_building0.geojson > ../temp/french_building.geojson
jq "$JQ_FILTER" ../temp/lake0.geojson > ../temp/lake.geojson
jq "$JQ_FILTER" ../temp/river0.geojson > ../temp/river.geojson
jq "$JQ_FILTER" ../temp/grass0.geojson > ../temp/grass.geojson



# MAKE MANY LAYERS FROM MANY JSON FILES

tippecanoe -e ../dalat-map-tiles/tiles \
--minimum-zoom=10 --maximum-zoom=17 \
--no-tile-compression -f \
--layer boring_building ../temp/boring_building.geojson \
--layer french_building ../temp/french_building.geojson \
--layer lake ../temp/lake.geojson \
--layer river ../temp/river.geojson \
--layer grass ../temp/grass.geojson




node save_bldgs_centroids.mjs