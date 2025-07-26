import { SOURCES_NAMES } from "../js/constants.mjs";
import { interpolate } from "../js/utils/isomorphic_utils.mjs";
import { constants as c } from "./constants.mjs";

export const CITY_WALL_COLOR = 'hsl(45, 85%, 0%)'

export const city_walls_fill = {
    name: 'City walls fill',
    type: 'fill',
    source: SOURCES_NAMES.CITY_TILES,
    'source-layer': 'city_walls_areas',
    drawing_importance: 2,
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
    drawing_importance: 2,
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
    filter: ["==", ["geometry-type"], "Polygon"],
    drawing_importance: 6,
    paint: {
        'fill-color': 'hsl(60, 81.82%, 43.14%)',
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
    }
}

export const unesco_areas_border = {
    name: 'UNESCO areas border',
    type: 'line',
    source: SOURCES_NAMES.CITY_TILES,
    'source-layer': 'unesco_areas',
    filter: ["==", ["geometry-type"], "Polygon"],
    drawing_importance: 6,
    paint: {
        'line-color': 'hsl(60, 81.82%, 43.14%)',
        'line-width': 1,
        'line-opacity': interpolate(c.CITY_BULK_DISAPPEARANCE_ZOOM, 0.65, 15, 0)
    },
}

// unesco_areas_titles
export const unesco_areas_titles = {
    name: 'UNESCO areas titles',
    type: 'symbol',
    source: SOURCES_NAMES.CITY_TILES,
    'source-layer': 'unesco_areas',
    filter: ["==", ["geometry-type"], "Point"],
    drawing_importance: 0,
    layout: {
        'text-size': 12,
        'text-font': ['Lato Regular'],
        "text-field": ["get", "title"],
    },
    paint: {
        'text-color': 'hsl(60, 71.82%, 13.14%)'
    },
}



export const non_french_bldgs_within_imperial_city_fill = {
    "name": "Non french bldgs within imperial city fill",
    "type": "fill",
    "source": SOURCES_NAMES.CITY_TILES,
    "source-layer": "non_french_bldgs_within_imperial_city",
    drawing_importance: 5,
    "paint": {
        "fill-color": 'hsl(60, 20.82%, 63.14%)',
        "fill-opacity": interpolate(14, 0.5, 15, 1)
    }
}