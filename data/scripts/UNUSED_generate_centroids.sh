#!/bin/bash

# Check if the input file is provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 input.geojson output.geojson"
    exit 1
fi

INPUT_FILE="$1"
OUTPUT_FILE="$2"

# touch "$OUTPUT_FILE"


# !!!!!!! ideally create a point only if feature has a title in handmade data
jq '
  . + 
  (
    . | map(
      if .geometry.type == "Polygon" or .geometry.type == "MultiPolygon" then
        {
          type: "Feature",
          id: ((.id | tostring) + "666666" | tonumber),
          geometry: {
            type: "Point",
            coordinates: (
              if .geometry.type == "Polygon" then
                (.geometry.coordinates[0] | reduce .[] as $point ({"x": 0, "y": 0, "n": 0};
                  {"x": (.x + $point[0]), "y": (.y + $point[1]), "n": (.n + 1)}
                ) | [.x / .n, .y / .n])
              elif .geometry.type == "MultiPolygon" then
                (reduce .geometry.coordinates[] as $polygon ({"x": 0, "y": 0, "n": 0};
                  reduce $polygon[0][] as $point (.;
                    {"x": (.x + $point[0]), "y": (.y + $point[1]), "n": (.n + 1)}
                  )
                ) | [.x / .n, .y / .n])
              else
                null
              end
            )
          },
          properties: .properties
        }
      else
        empty
      end
    )
  )
' "$INPUT_FILE" >"$OUTPUT_FILE"

echo "Centroid features added and saved to $OUTPUT_FILE."
