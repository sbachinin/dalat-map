import { SOURCES_NAMES } from "../sources.mjs";
import { BRIGHT_LAKE_COLOR, PALE_LAKE_COLOR } from "./constants.mjs";

export const river_lines = {
    id: 'River lines',
    type: 'line',
    minzoom: 12,
    source: SOURCES_NAMES.CITY_TILES,
    'source-layer': 'river_lines',
    "layout": {
        "visibility": "visible",
        "line-cap": "round",
        "line-join": "round",
    },
    "paint": {
        "line-color": [
            "interpolate",
            ["linear", 2],
            ["zoom"],
            10, BRIGHT_LAKE_COLOR,
            13.7, PALE_LAKE_COLOR,
        ],
        'line-width': [
            "interpolate",
            ["linear"],
            ["zoom"],
            14,
            2,
            18,
            6
        ]
    },
}
