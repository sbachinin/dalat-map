import { SOURCES_NAMES } from "../js/sources.mjs";

const CITY_WALL_COLOR = 'hsl(45, 85%, 45%)'

export const city_walls_fill = {
    name: 'City walls fill',
    type: 'fill',
    source: SOURCES_NAMES.CITY_TILES,
    'source-layer': 'city_walls_areas',
    paint: {
        'fill-color': CITY_WALL_COLOR,
        'fill-antialias': true,
        'fill-opacity': [
            "interpolate",
            ["linear"],
            ["zoom"],
            11,
            0.5,
            13,
            1
        ]
    }
}

export const city_walls_thickening_outline = {
    name: 'City walls thickening outline',
    type: 'line',
    source: SOURCES_NAMES.CITY_TILES,
    'source-layer': 'city_walls_areas',
    'paint': {
        'line-color': CITY_WALL_COLOR,
        'line-width': [
            "interpolate",
            ["linear"],
            ["zoom"],
            10,
            2,
            15.5,
            0
        ],
        'line-opacity': [
            "interpolate",
            ["linear"],
            ["zoom"],
            11,
            0.5,
            13,
            1
        ]
    }
}