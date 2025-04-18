#!/bin/bash

no_download=false
for arg in "$@"; do
  if [ "$arg" == "no-download" ]; then
    no_download=true
    break
  fi
done

bldgs_handmade_data=$(node -e "
  import { bldgs_handmade_data } from '../static/bldgs_handmade_data.mjs';
  console.log(JSON.stringify(bldgs_handmade_data));
")

land_areas_handmade_data=$(node -e "
  import { land_areas_handmade_data } from '../static/handmade_data.mjs';
  console.log(JSON.stringify(land_areas_handmade_data));
")

# REMOVE OLD
rm ../temp/*.geojson

# DOWNLOAD XML FROM OVERPASS
if [ "$no_download" == false ]; then
  rm ../temp/*.osm
  curl -o ../temp/output.osm "https://overpass-api.de/api/map?bbox=108.3801,11.8800,108.5200,12.0100"
fi

# CONVERT TO GEOJSON
osmtogeojson ../temp/output.osm >../temp/from_osm.geojson

# create a lineString feature from dalat_bulk_geometry
jq '.[0] | { 
    type: "Feature", 
    properties: .properties, 
    geometry: { 
        type: "LineString", 
        coordinates: .geometry.coordinates[0] 
    } 
}' ../static/dalat_bulk_geometry.geojson >../temp/dalat_bulk_geometry_as_linestring.geojson

# merge my custom geojson into osm's geojson,
# prioritize custom features in case of duplicate ids
jq -s '{
  type: "FeatureCollection",
  features: (map(.features) | add | reverse | unique_by(.id) | reverse)
}' ../temp/from_osm.geojson ../static/all_custom_features.geojson >../temp/all.geojson

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
        and (.id != 1275206355)
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
    select(
      .properties.railway == "rail"
      or .properties.railway == "station"
    )
  )
' ../temp/filtered.geojson >../temp/railway.geojson

jq '
  .features | map(select(.properties.natural == "peak"))
' ../temp/filtered.geojson >../temp/peaks.geojson

jq '
  .features | map(
    select(
      .properties.aerialway == "cable_car"
      or .properties.aerialway == "station"
    )
  )
' ../temp/filtered.geojson >../temp/transportation_other.geojson

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

# COPY ALL LAND_AREAS FROM HANDMADE DATA TO A DEDICATED GEOJSON
jq --argjson land_areas_handmade_data "$land_areas_handmade_data" '
  .features | map(
    select(.id | tostring | IN($land_areas_handmade_data | keys_unsorted[]))
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
jq "$JQ_FILTER" ../temp/boring_building0.geojson >../temp/boring_building00.geojson
jq "$JQ_FILTER" ../temp/french_building0.geojson >../temp/french_building00.geojson
jq "$JQ_FILTER" ../temp/lake0.geojson >../temp/lake.geojson
jq "$JQ_FILTER" ../temp/river0.geojson >../temp/river.geojson
jq "$JQ_FILTER" ../temp/land_areas0.geojson >../temp/land_areas00.geojson

jq --argjson bldgs_hmd__ "$bldgs_handmade_data" '
  map(
    .properties = {
      has_details: ((
        ($bldgs_hmd__[(.id | tostring)] | .images // []) | length > 0
      ) or (
        ($bldgs_hmd__[(.id | tostring)] | .links // []) | length > 0
      ) or (
        ($bldgs_hmd__[(.id | tostring)] | .wikipedia // "") | length > 0
      ) or (
        ($bldgs_hmd__[(.id | tostring)] | .google // "") | length > 0
      ) or (
        ($bldgs_hmd__[(.id | tostring)] | .subtitle // "") | length > 0
      )),
      has_title: ($bldgs_hmd__[(.id | tostring)] | (has("title") and .title != null)),
      is_important: ($bldgs_hmd__[(.id | tostring)] | (.second_rate // false) != true)
    }
  )' ../temp/french_building00.geojson >../temp/french_building.geojson

# ADD HAS_TITLE PROP TO ALL SHIT BLDGS THAT HAVE HANDMADE TITLES
jq --argjson bldgs_hmd__ "$bldgs_handmade_data" 'map(
    if (.id | tostring) as $id | $bldgs_hmd__[$id].title then
      .properties += { has_title: true }
    else
      .
    end
  )
' ../temp/boring_building00.geojson >../temp/boring_building.geojson

# COPY AREA_TYPE PROPERTY FROM HANDMADE DATA TO A GEOJSON FEATURE
jq --argjson land_areas_handmade_data "$land_areas_handmade_data" '
  map(
    if ($land_areas_handmade_data[(.id | tostring)] and $land_areas_handmade_data[(.id | tostring)].area_type) then
      .properties.area_type = $land_areas_handmade_data[(.id | tostring)].area_type
    else
      .
    end
  )
' ../temp/land_areas00.geojson >../temp/land_areas.geojson

# generated centroids didn't provide good-looking titles so I switched to manual title_coords
# ./generate_centroids.sh ../temp/land_areas00.geojson ../temp/land_areas.geojson

node save_polygons_centroids_etc.mjs
node save_some_features_ids.mjs

# MAKE MANY LAYERS FROM MANY JSON FILES
tippecanoe -e ../../dalat-map-tiles/tiles \
  --minimum-zoom=10 --maximum-zoom=17 \
  --no-tile-compression -f \
  ../temp/boring_building.geojson \
  ../temp/french_building.geojson \
  ../temp/lake.geojson \
  ../temp/river.geojson \
  ../temp/land_areas.geojson \
  ../temp/highway.geojson \
  ../temp/railway.geojson \
  ../temp/peaks.geojson \
  ../temp/transportation_other.geojson \
  ../temp/dalat_bulk_geometry_as_linestring.geojson \
  ../static/dead_buildings.geojson \
  ../static/dalat_bulk_geometry.geojson
