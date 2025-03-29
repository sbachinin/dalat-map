import { SOURCES_NAMES } from "../sources.mjs";
import { FIRST_DETAILS_MINZOOM, PALE_TITLES_COLOR, PALE_TITLES_SIZE, RAILWAY_LINE_COLOR } from "./constants.mjs";


const railway_layers = [
    {
        "id": "Railway line",
        "type": "line",
        "source": SOURCES_NAMES.DALAT_TILES,
        "source-layer": "railway",
        minzoom: FIRST_DETAILS_MINZOOM,
        "layout": {
            "line-cap": "round",
            "line-join": "round"
        },
        "paint": {
            "line-color": RAILWAY_LINE_COLOR,
            "line-width": [
                "interpolate", ["linear"], ["zoom"],
                10, 1,
                14, 2,
                16, 3
            ],
        },
        filter: ["==", ["get", "railway"], "rail"]
    },

    {
        id: 'Train station tiny squares with titles',
        type: 'symbol',
        source: SOURCES_NAMES.DALAT_TILES,
        'source-layer': 'railway',
        minzoom: FIRST_DETAILS_MINZOOM,
        layout: {
            "text-anchor": "top",
            "text-offset": [0, 0.2],
            'text-size': PALE_TITLES_SIZE,
            'text-font': ['Lato Regular'],
            'text-field': 'Trai Mat\nstation',
            "icon-image": "railway_tiny_square",
            "icon-size": 0.4,
        },
        paint: {
            'text-color': PALE_TITLES_COLOR
        },
        "filter": ["==", "$id", 3377406129]  // only Trai Mat
    }
]

export const transportation_other = [
    ...cable_car_layers,
    ...railway_layers
]