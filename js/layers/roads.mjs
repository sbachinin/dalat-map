import { SOURCES_NAMES } from "../sources.mjs"
import { MINOR_ROADS_MINZOOM } from "./constants.mjs"

const road_color = "hsl(30, 0%, 59%)"
const darker_tertiary_road_color = "hsl(30, 0%, 71%)"
const minor_road_color = "hsl(30, 0%, 73%)"

const common_road_props = {
    "type": "line",
    "source": SOURCES_NAMES.DALAT_TILES,
    "layout": {
        "line-cap": "round",
        "line-join": "round",
        "visibility": "visible"
    },
}

const tertiaryRoad = {
    id: 'Tertiary road',
    ...common_road_props,
    "source-layer": "major_roads",
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
    "source-layer": "major_roads",
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
    "filter": ["!in", "highway", "tertiary"]
}

const majorRoad = {
    "id": "Major road",
    ...common_road_props,
    "source-layer": "major_roads",
    "minzoom": 12.8,
    "paint": {
        "line-color": [
            "interpolate",
            ["linear", 2],
            ["zoom"],
            12.8,
            road_color,
            13.8,
            '#e4e4e4'
        ],
        "line-width": [
            "interpolate",
            ["linear", 2],
            ["zoom"],
            14, 2,
            16, 3.5,
            20, 6
        ]
    },
    "filter": ["!in", "highway", "tertiary"]
}

const minorRoad = {
    "id": "Minor road",
    ...common_road_props,
    "source-layer": "minor_roads",
    "minzoom": MINOR_ROADS_MINZOOM,
    "paint": {
        "line-color": minor_road_color,
        "line-width": [
            "interpolate",
            ["linear", 2],
            ["zoom"],
            13.7, 1,
            20, 2
        ],
        'line-blur': 1, 
    }
}

export default [
    minorRoad,
    tertiaryRoad,
    majorRoadOutline,
    majorRoad,
]