import { SOURCES_NAMES } from "../sources.mjs";
import { BRIGHT_LAKE_COLOR, PALE_LAKE_COLOR, WATER_TITLE_COLOR } from "./constants.mjs";

const river_props = {
    type: 'line',
    source: SOURCES_NAMES.DALAT_TILES,
    'source-layer': 'river',
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

export const cam_ly_line = {
    ...river_props,
    id: "River Cam Ly",
    "filter": ['==', 'name', 'Suối Cam Ly']
}

export const other_rivers_lines = {
    ...river_props,
    id: "All rivers but Cam Ly",
    minzoom: 14,
    "filter": ['!=', 'name', 'Suối Cam Ly']
}






export const rivers_titles = {
    "name": "Rivers titles",
    "type": "symbol",
    source: SOURCES_NAMES.DALAT_TILES,
    'source-layer': 'river',
    "layout": {
        "text-field": "Cam  Ly",
        "text-font": ["Lato Regular"],
        "text-size": 10,
        "text-max-width": 8,
        "text-anchor": "bottom",

        "symbol-placement": "line",
        "symbol-spacing": 500,
        "text-allow-overlap": false,
        "text-padding": 5,
        "text-letter-spacing": 0.1,
    },
    "paint": {
        "text-color": WATER_TITLE_COLOR
    }
}
