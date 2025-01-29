#!/bin/bash


BLDGS_JSON=$(node -e "import { all_handmade_data } from './static/handmade_data.mjs'; console.log(JSON.stringify(all_handmade_data));")

echo "$BLDGS_JSON"

jq --argjson bldgs_data "$BLDGS_JSON" '
    map(
        del(.properties.name) |
        .properties.title = $bldgs_data[(.id | tostring)].title
    )
' french_building.geojson > french_building_with_proper_names.geojson
