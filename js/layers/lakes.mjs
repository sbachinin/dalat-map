import { BRIGHT_LAKE_COLOR, LAKE_TITLE_COLOR, PALE_LAKE_COLOR, PALE_TITLES_SIZE } from "./constants.mjs";

export default [
    {
        "id": "Primary Water",
        "type": "fill",
        "source": "dalat-tiles",
        "source-layer": "lake",
        "paint": {
            "fill-color": [
                "interpolate",
                ["linear", 2],
                ["zoom"],
                10, BRIGHT_LAKE_COLOR,
                13.7, PALE_LAKE_COLOR,
            ]
        }
    },

    {
        id: 'Lakes titles',
        type: 'symbol',
        "source": "lakes_titles",
        minzoom: 12.5,
        layout: {
            "text-field": ["get", "title"],
            'text-size': PALE_TITLES_SIZE,
            'text-font': ['Lato Regular']            
        },
        paint: {
            'text-color': LAKE_TITLE_COLOR
        }
    }
]
