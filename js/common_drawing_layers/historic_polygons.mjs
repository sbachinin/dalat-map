import { SOURCES_NAMES } from "../constants.mjs"
import * as c from "./constants.mjs"

const historic_fill_common_props = {
    "type": "fill",
    "source": SOURCES_NAMES.CITY_TILES,
    drawing_importance: 2,
    "paint": {
        "fill-color": c.FRENCH_FILL_COLOR,
        "fill-antialias": true
    },
}



// the following separation was necessary
// in order to render all detailful bldgs after all detailless,
// to prevent the detailful bldgs' border from being covered by borderless buildings' parts
const historic_detailless_bldg_fill = {
    "name": "Historic detailless building fill",
    ...historic_fill_common_props,
    filter: ["!=", ["get", "is_selectable"], true],
}
const historic_detailful_bldg_fill = {
    "name": "Historic detailful building",
    ...historic_fill_common_props,
    filter: ["==", ["get", "is_selectable"], true]
}



export const HISTORIC_POLYGONS_MAX_THICKENING = 0.7

const historic_thickening_outline_common_props = {
    'type': 'line',
    "source": SOURCES_NAMES.CITY_TILES,
    drawing_importance: 2,
    'paint': {
        'line-color': c.FRENCH_FILL_COLOR,
        'line-width': [
            "interpolate",
            ["linear"],
            ["zoom"],
            14,
            HISTORIC_POLYGONS_MAX_THICKENING,
            15.5,
            0
        ]
    },
}

const historic_detailless_thickening_outline = {
    name: 'Historic bldg without details thickening outline',
    ...historic_thickening_outline_common_props,
    filter: ["!=", ["get", "is_selectable"], true],
}

const historic_detailful_thickening_outline = {
    name: 'Historic bldg with details thickening outline',
    ...historic_thickening_outline_common_props,
    filter: ["==", ["get", "is_selectable"], true]
}


// It's very narrow, not looking like a border, but just making the polygons a little crisper
const historic_dark_outline = {
    'name': 'Historic buildings dark outline',
    'type': 'line',
    "source": SOURCES_NAMES.CITY_TILES,
    drawing_importance: 2,
    'paint': {
        'line-color': c.FRENCH_DARK_BORDER_COLOR,
        'line-width': [
            "interpolate",
            ["linear", 2],
            ["zoom"],
            14,
            HISTORIC_POLYGONS_MAX_THICKENING + 0.5,
            15.5,
            1
        ]
    },
}



export const historic_polygons = [
    historic_dark_outline,
    historic_detailless_thickening_outline,
    historic_detailless_bldg_fill,
    historic_detailful_thickening_outline,
    historic_detailful_bldg_fill
]