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
osmtogeojson ../temp/output.osm >../temp/all.geojson

# DROP NON-NUMERIC PART OF FEATURE ID SUCH AS "way/"
jq '
  .features[] |= (
    .id |= (sub("^(way|node|relation)/"; "") | tonumber)
  )
' ../temp/all.geojson >../temp/filtered.geojson

# SPLIT GEOJSON BY LAYER

jq '
  .features
  | map(
      select(
        .properties.building != null
        and (.properties."building:architecture" != "french_colonial")
      )
    )
' ../temp/filtered.geojson >../temp/boring_building0.geojson

jq '
  .features | map(
    select(.properties."building:architecture" == "french_colonial")
  )
' ../temp/filtered.geojson >../temp/french_building0.geojson

jq '
  .features | map(select(.properties.highway!= null))
' ../temp/filtered.geojson >../temp/highway.geojson

jq '
  .features | map(
    select(.properties.natural == "water"
    and (
      .properties.name == "Hồ Xuân Hương"
      or .properties.name == "Hồ Tuyền Lâm" or .properties.name == "Hồ Chiến Thắng" or .properties.name == "Hồ Đa Thiện")
    )
  )
' ../temp/filtered.geojson >../temp/lake0.geojson

jq '
  .features | map(
    select(.properties.waterway == "stream")
  )
' ../temp/filtered.geojson >../temp/river0.geojson
jq '
  .features | map(
    select(
      .id == 99661171
      or .id == 361692208
      or .id == 1307493492
      or .id == 473556887
      or .id == 99660966
      or .id == 99660916
      or .id == 969458761
    )
  )
' ../temp/filtered.geojson >../temp/land_areas0.geojson

# TAKE ONLY REQUIRED FEATURE PROPERTIES
# TODO: HIGHWAYS UNTOUCHED HERE SO FAR NOT TO BREAK STYLE FILTERS)
JQ_FILTER='map({
  type: .type,
  geometry: .geometry,
  id: .id,
  properties: {}
})'
jq "$JQ_FILTER" ../temp/boring_building0.geojson >../temp/boring_building.geojson
jq "$JQ_FILTER" ../temp/french_building0.geojson >../temp/french_building.geojson
jq "$JQ_FILTER" ../temp/lake0.geojson >../temp/lake.geojson
jq "$JQ_FILTER" ../temp/river0.geojson >../temp/river.geojson
jq "$JQ_FILTER" ../temp/land_areas0.geojson >../temp/land_areas00.geojson





handmade_data=$(node -e "
  import { all_handmade_data } from '../static/handmade_data.mjs';
  console.log(JSON.stringify(all_handmade_data));
")

jq --argjson handmade_data "$handmade_data" '
  map(
    if ($handmade_data[(.id | tostring)] and $handmade_data[(.id | tostring)].area_type) then
      .properties.area_type = $handmade_data[(.id | tostring)].area_type
    else
      .
    end
  )
' ../temp/land_areas00.geojson >../temp/land_areas.geojson

# generated centroids didn't provide good-looking titles so I switched to manual title_coords
# ./generate_centroids.sh ../temp/land_areas00.geojson ../temp/land_areas.geojson

# MAKE MANY LAYERS FROM MANY JSON FILES

tippecanoe -e ../../dalat-map-tiles/tiles \
  --minimum-zoom=10 --maximum-zoom=17 \
  --no-tile-compression -f \
  ../temp/boring_building.geojson \
  ../temp/french_building.geojson \
  ../temp/lake.geojson \
  ../temp/river.geojson \
  ../temp/land_areas.geojson \
  ../temp/highway.geojson

node save_bldgs_centroids.mjs
