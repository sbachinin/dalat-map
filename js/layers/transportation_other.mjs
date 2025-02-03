import { FIRST_DETAILS_MINZOOM, PALE_TITLES_COLOR } from "./constants.mjs";

export const transportation_other = [
    {
        "id": "Cable car",
        type: 'line',
        source: 'dalat-tiles',
        'source-layer': 'transportation_other',
        "layout": {
            // "line-cap": "round",
            // "line-join": "round"
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
            "icon-size": 0.6,
            'icon-allow-overlap': true,            
        },
        "filter": [
            'all',
            ["==", ["get", "aerialway"], "station"],
            ["==", ["geometry-type"], "Point"]
        ]
    }
]
