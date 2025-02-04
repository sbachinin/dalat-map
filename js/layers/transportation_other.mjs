import { FIRST_DETAILS_MINZOOM, PALE_TITLES_COLOR, PALE_TITLES_SIZE, RAILWAY_LINE_COLOR } from "./constants.mjs";

const cable_car_layers = [
    {
        "id": "Cable car",
        type: 'line',
        source: 'dalat-tiles',
        'source-layer': 'transportation_other',
        "layout": {
        },
        "paint": {
            "line-color": "#6666ff",
            "line-width": [
                "interpolate", ["linear"], ["zoom"],
                10, 1,
                15, 2
            ],
            "line-dasharray": [1, 1]
        },
        "filter": ["==", ["get", "aerialway"], "cable_car"]
    },
    {
        "id": "Cable car name",
        type: 'symbol',
        source: 'dalat-tiles',
        'source-layer': 'transportation_other',
        minzoom: FIRST_DETAILS_MINZOOM,
        "filter": ["==", ["get", "aerialway"], "cable_car"],
        "layout": {
            "text-field": "Cable car",
            "text-font": ["Lato Regular"],
            "text-size": 10,
            "symbol-placement": "line",
            "text-letter-spacing": 0.1,
            "text-anchor": "bottom",
            "text-offset": [0, -0.1]
        },
        "paint": {
            "text-color": PALE_TITLES_COLOR,
        },
        "filter": ["==", ["get", "aerialway"], "cable_car"]
    },
    {
        "id": "cable-car-endpoints",
        "type": "symbol",
        "source": "dalat-tiles",
        "source-layer": "transportation_other",
        "layout": {
            "icon-image": "tiny_non_french_square",
            "icon-size": 0.4,
            'icon-allow-overlap': true,
        },
        "filter": [
            'all',
            ["==", ["get", "aerialway"], "station"],
            ["==", ["geometry-type"], "Point"]
        ]
    }
]

const railway_layers = [
    {
        "id": "railway",
        "type": "line",
        "source": "dalat-tiles",
        "source-layer": "railway",
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
        source: "dalat-tiles",
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