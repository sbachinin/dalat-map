#!/bin/bash


BLDGS_JSON=$(node -e "import { buildings_handmade_data } from './static/buildings_handmade_data.mjs'; console.log(JSON.stringify(buildings_handmade_data));")

echo "$BLDGS_JSON"

jq --argjson bldgs_data "$BLDGS_JSON" '
    map(
        del(.properties.name) |
        .properties.name = ($bldgs_data[(.id | tostring)].name // .properties.name)
    )
' french_building.geojson > french_building_with_proper_names.geojson
