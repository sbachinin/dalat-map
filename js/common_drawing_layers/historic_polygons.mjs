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



const HISTORIC_POLYGONS_MAX_THICKENING = 0.7

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

const get_dark_outline_props = high_zoom_thickness => {
    return {
        'type': 'line',
        "source": SOURCES_NAMES.CITY_TILES,
        drawing_importance: 2,
        'paint': {
            'line-color': c.FRENCH_DARK_BORDER_COLOR,
            'line-width': [
                "interpolate",
                ["linear", 2],
                ["zoom"],
                // at low zoom, this outline has only visual purpose
                // (it's very narrow behind the thickening and adds some clarity to polygons)
                14,
                HISTORIC_POLYGONS_MAX_THICKENING + 1,
                15.5,
                high_zoom_thickness
            ]
        },
    }
}

const historic_detailless_dark_outline = {
    'name': 'Historic buildings without details dark outline',
    ...get_dark_outline_props(1),
    filter: ["!=", ["get", "is_selectable"], true],
}

const historic_detailful_dark_outline = {
    'name': 'Historic buildings with details dark outline',
    ...get_dark_outline_props(4),
    filter: ["==", ["get", "is_selectable"], true]
}



export const historic_polygons = [
    historic_detailless_dark_outline,
    historic_detailless_thickening_outline,
    historic_detailless_bldg_fill,
    historic_detailful_dark_outline,
    historic_detailful_thickening_outline,
    historic_detailful_bldg_fill
]