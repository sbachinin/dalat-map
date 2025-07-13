import { FRENCH_DEAD_FILL_COLOR, SELECTED_DEAD_FILL_COLOR } from "./constants.mjs";

export const dead_buildings_drawing_layers = [
    {
        "type": "fill",
        "minzoom": 14,
        "paint": {
            "fill-color": FRENCH_DEAD_FILL_COLOR,
            "fill-antialias": true
        },
        filter: ["==", ["geometry-type"], "Polygon"],
        props_when_selected: {
            "paint": {
                "fill-color": SELECTED_DEAD_FILL_COLOR
            }
        }
    },
    {
        type: 'line',
        "minzoom": 14,
        "paint": {
            "line-color": FRENCH_DEAD_FILL_COLOR,
            "line-width": 2,
        },
        filter: ["==", ["geometry-type"], "Polygon"],
        props_when_selected: {
            layout: {
                visibility: 'visible'
            },
        }
    }
]