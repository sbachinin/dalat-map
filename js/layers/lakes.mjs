import { PALE_TITLES_COLOR, PALE_TITLES_SIZE } from "./constants.mjs";

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
                10, 'hsl(193.5, 100%, 62.4%)',
                13.7, 'hsl(193.5, 70%, 75%)',
            ]
        }
    },

    {
        id: 'Lakes titles',
        type: 'symbol',
        "source": "lakes_titles",
        minzoom: 13, // TODO ok??
        layout: {
            "text-field": ["get", "title"],
            'text-size': PALE_TITLES_SIZE,
            'text-font': ['Lato Regular']            
        },
        paint: {
            'text-color': PALE_TITLES_COLOR
        }
    }
]
