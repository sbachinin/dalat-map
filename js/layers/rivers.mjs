import { FIRST_DETAILS_MINZOOM, PALE_TITLES_COLOR, PALE_TITLES_SIZE } from "./constants.mjs";

export default [
    {
        id: "River Cam Ly",
        type: 'line',
        source: 'dalat-tiles',
        'source-layer': 'river',
        "layout": {
            "visibility": "visible",
            "line-cap": "round",
            "line-join": "round",
        },
        "paint": {
            "line-color": 'RGB(77, 204, 241)',
            'line-width': [
                "interpolate",
                ["linear"],
                ["zoom"],
                14,
                1.5,
                18,
                6
            ]
        },
        "filter": ['==', 'name', 'Suối Cam Ly']
    },
    {
        id: "All rivers but Cam Ly",
        type: 'line',
        source: 'dalat-tiles',
        'source-layer': 'river',
        minzoom: 14,
        "layout": {
            "visibility": "visible",
            "line-cap": "round",
            "line-join": "round",
        },
        "paint": {
            "line-color": 'RGB(77, 204, 241)',
            'line-width': [
                "interpolate",
                ["linear"],
                ["zoom"],
                14, 1,
                18, 4
            ]
        },
        "filter": ['!=', 'name', 'Suối Cam Ly']
    }
]

export const datanla_waterfall_layer = {
    id: "Datanla waterfall",
    type: 'symbol',
    source: 'datanla_waterfall',
    minzoom: FIRST_DETAILS_MINZOOM,
    layout: {
        "icon-image": "tiny_non_french_square",
        "icon-size": 0.4,
        "text-field": "Datanla\nwaterfall",
        "text-anchor": "top",
        "text-offset": [0, 0.2],
        'text-size': PALE_TITLES_SIZE,
        'text-font': ['Lato Regular'],
        "symbol-sort-key": 1,
        "icon-allow-overlap": true,
        "text-allow-overlap": true,
    },
    paint: {
        'text-color': PALE_TITLES_COLOR
    },
}