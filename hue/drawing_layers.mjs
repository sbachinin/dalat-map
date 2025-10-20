import { SELECTABLE_BORING_FILL_COLOR, TITLED_NONSELECTABLE_BORING_FILL_COLOR, UNESCO_AREA_BORDER_COLOR, UNESCO_AREA_FILL_COLOR } from "../js/common_drawing_layers/constants.mjs";
import { DR_IM } from "../js/common_drawing_layers/drawing_importance.mjs";
import { SOURCES_NAMES } from "../js/constants.mjs";
import { interpolate } from "../js/utils/isomorphic_utils.mjs";
import { constants as c } from "./constants.mjs";

export const CITY_WALL_COLOR = [
    'interpolate',
    ['linear'],
    ['zoom'],
    10, 'hsl(45, 85%, 0%)',
    17, 'hsl(45, 0%, 70%)'
]

export const city_walls_fill = {
    name: 'City walls fill',
    type: 'fill',
    source: SOURCES_NAMES.CITY_TILES,
    'source-layer': 'city_walls_areas',
    drawing_importance: DR_IM.CITY_WALLS,
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
    drawing_importance: DR_IM.CITY_WALLS,
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
    drawing_importance: DR_IM.LAND_AREAS,
    paint: {
        'fill-color': UNESCO_AREA_FILL_COLOR,
        'fill-antialias': true,
        'fill-opacity': interpolate(12, 0.2, 15, 0.1)
    }
}

export const unesco_areas_border = {
    name: 'UNESCO areas border',
    type: 'line',
    source: SOURCES_NAMES.CITY_TILES,
    'source-layer': 'unesco_areas',
    filter: ["==", ["geometry-type"], "Polygon"],
    drawing_importance: DR_IM.LAND_AREAS,
    paint: {
        'line-color': UNESCO_AREA_BORDER_COLOR,
        'line-width': 1,
        'line-opacity': interpolate(12, 0.2, 15, 0.1)
    },
}

export const unesco_areas_titles = {
    name: 'UNESCO areas titles',
    type: 'symbol',
    source: SOURCES_NAMES.CITY_TILES,
    'source-layer': 'unesco_areas',
    filter: ["==", ["geometry-type"], "Point"],
    drawing_importance: DR_IM.TITLES,
    layout: {
        'text-size': interpolate(12, 9, 15, 12),
        'text-font': ['Noto Sans Regular'],
        "text-field": ["get", "title"],
    },
    paint: {
        'text-color': 'hsl(25, 71.82%, 20%)'
    },
}



export const non_french_bldgs_within_imperial_city_fill = {
    "name": "Non french bldgs within imperial city fill",
    "type": "fill",
    "source": SOURCES_NAMES.CITY_TILES,
    "source-layer": "non_french_bldgs_within_imperial_city",
    drawing_importance: DR_IM.IMPORTANT_BORING_BLDG_FILL,
    "paint": {
        "fill-color": SELECTABLE_BORING_FILL_COLOR, // 'hsl(60, 20.82%, 63.14%)',
        "fill-opacity": interpolate(14, 0.5, 15, 1)
    }
}