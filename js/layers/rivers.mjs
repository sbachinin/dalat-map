import { mainOpacityReveal } from './mainReveal.mjs'

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
        minzoom: mainOpacityReveal[3],
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
            ],
            'line-opacity': mainOpacityReveal
        },
        "filter": ['!=', 'name', 'Suối Cam Ly']
    }
]