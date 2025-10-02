import { DEFAULT_MAX_ZOOM, SOURCES_NAMES } from "../constants.mjs";
import { FRENCH_DEAD_FILL_COLOR } from "./constants.mjs";
import { titles_common_layout_props } from "./drawing_layers.mjs";

export const dead_buildings_layers = [
    {
        id: "Dead buildings fill",
        source: SOURCES_NAMES.DEAD_BUILDINGS,
        "type": "fill",
        "minzoom": 14,
        "paint": {
            "fill-color": FRENCH_DEAD_FILL_COLOR,
            "fill-antialias": true
        },
        filter: ["==", ["geometry-type"], "Polygon"],
        drawing_importance: 1
    },
    {
        id: "Dead buildings border",
        source: SOURCES_NAMES.DEAD_BUILDINGS,
        type: 'line',
        "minzoom": 14,
        "paint": {
            "line-color": FRENCH_DEAD_FILL_COLOR,
            "line-width": 2,
        },
        filter: ["==", ["geometry-type"], "Polygon"],
    },
    {
        "id": "Dead buildings titles",
        "source": SOURCES_NAMES.DEAD_BUILDINGS,
        "type": "symbol",
        "minzoom": 15.5,
        layout: {
            ...titles_common_layout_props,
            'text-size': [
                "interpolate",
                ["linear"],
                ["zoom"],
                14,
                12,
                DEFAULT_MAX_ZOOM,
                16
            ],
            'text-font': ['Merriweather Italic']
        },
        paint: {
            'text-color': 'hsl(0, 0%, 40%)',
        },
        filter: ["==", ["geometry-type"], "Point"]
    }
]