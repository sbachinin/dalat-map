import { SOURCES_NAMES } from "../js/constants.mjs";

export const CITY_WALL_COLOR = 'hsl(45, 85%, 0%)'

export const city_walls_fill = {
    name: 'City walls fill',
    type: 'fill',
    source: SOURCES_NAMES.CITY_TILES,
    'source-layer': 'city_walls_areas',
    paint: {
        'fill-color': CITY_WALL_COLOR,
        'fill-antialias': true,
        'fill-opacity': 0.65
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
            1,
            15.5,
            0
        ],
        'line-opacity': 0.65
    }
}



export const unesco_areas_fill = {
    name: 'UNESCO areas fill',
    type: 'fill',
    source: SOURCES_NAMES.CITY_TILES,
    'source-layer': 'unesco_areas',
    paint: {
        'fill-color': 'yellow',
        'fill-antialias': true,
        'fill-opacity': [
            "interpolate",
            ["linear"],
            ["zoom"],
            10,
            0.3,
            15,
            0.1
        ]
    },
}

export const unesco_areas_border = {
    name: 'UNESCO areas border',
    type: 'line',
    source: SOURCES_NAMES.CITY_TILES,
    'source-layer': 'unesco_areas',
    paint: {
        'line-color': 'yellow',
        'line-width': 1,
        'line-opacity': 0.65
    }
}