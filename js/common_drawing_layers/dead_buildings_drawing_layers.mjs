import { FRENCH_DEAD_FILL_COLOR } from "./constants.mjs";

export const dead_buildings_drawing_layers = [
    {
        "type": "fill",
        "minzoom": 14,
        "paint": {
            "fill-color": FRENCH_DEAD_FILL_COLOR,
            "fill-antialias": true
        },
        filter: ["==", ["geometry-type"], "Polygon"]
    },
    /* {
        type: 'symbol',
        "minzoom": 14,
        layout: {
            'icon-image': 'skull-icon',
            'icon-size': [
                'interpolate',
                ['linear'],
                ['zoom'],
                12, 0.005,
                18, 0.05
            ]
        },
        filter: ['==', ['geometry-type'], 'Point']
    } */
]