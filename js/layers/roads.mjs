import { mainOpacityReveal } from './mainReveal.mjs'

const road_color = "hsl(30, 0%, 59%)"
const darker_tertiary_road_color = "hsl(30, 0%, 71%)"
const minor_road_color = "hsl(30, 0%, 73%)"

const common_road_props = {
    "type": "line",
    "source": "dalat-tiles",
    "source-layer": "highway",
    "layout": {
        "line-cap": "round",
        "line-join": "round",
        "visibility": "visible"
    },
}

const tertiaryRoad = {
    id: 'Tertiary road',
    ...common_road_props,
    "minzoom": 10,
    "paint": {

        "line-color": darker_tertiary_road_color,
        "line-width": [
            "interpolate",
            ["linear", 2],
            ["zoom"],
            10, 1,
            14, 1.5,
            16, 3.5,
            20, 6
        ],
    },
    "filter": ["in", "highway", "tertiary",]
}

const majorRoadOutline = {
    "id": "Major road outline",
    ...common_road_props,
    "minzoom": 10,
    "paint": {
        "line-color": road_color,
        "line-width": [
            "interpolate",
            ["linear", 2],
            ["zoom"],
            10, 1.5,
            12, 2,
            16, 8,
            20, 12
        ]
    },
    "filter": [
        "in",
        "highway",
        "primary",
        "primary_link",
        "secondary",
        "trunk"
    ]
}

const majorRoad = {
    "id": "Major road",
    ...common_road_props,
    "minzoom": 13,
    "paint": {
        "line-color": '#d6d6d6',
        "line-width": [
            "interpolate",
            ["linear", 2],
            ["zoom"],
            14, 2,
            16, 3.5,
            20, 6
        ],
        "line-opacity": [
            "interpolate",
            ["linear", 2],
            ["zoom"],
            13, 0,
            15, 1
        ]
    },
    "filter": [
        "in",
        "highway",
        "primary",
        "primary_link",
        "secondary",
        "trunk"
    ]
}

const minorRoad = {
    "id": "Minor road",
    ...common_road_props,
    "minzoom": mainOpacityReveal[3],
    "paint": {
        "line-color": minor_road_color,
        "line-width": [
            "interpolate",
            ["linear", 2],
            ["zoom"],
            13.7, 1,
            20, 2
        ],
        "line-opacity": mainOpacityReveal,
        'line-blur': 1, 
    },
    "filter": [
        "all",
        [
            "any",
            ["!has", "brunnel"],
            [
                "in",
                "brunnel",
                "bridge",
                "ford"
            ]
        ],
        [
            "any",
            ["!has", "class"],
            [
                "in",
                "class",
                "bus_guideway",
                "busway",
                "courtyard",
                "minor",
                "path_construction",
                "raceway",
                "raceway_construction",
                "service",
                "storage_tank",
                "track"
            ]
        ]
    ]
}

export default [
    minorRoad,
    tertiaryRoad,
    majorRoadOutline,
    majorRoad,
]