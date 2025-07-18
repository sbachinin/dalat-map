import { SOURCES_NAMES } from "../constants.mjs"
import * as c from "./constants.mjs"

export const french_fill_common_props = {
    "type": "fill",
    "source": SOURCES_NAMES.CITY_TILES,
    "source-layer": "french_building",
    "paint": {
        "fill-color": c.FRENCH_FILL_COLOR,
        "fill-antialias": true
    },
}



// the following separation was necessary
// in order to render all detailful bldgs after all detailless,
// to prevent the detailful bldgs' border from being covered by borderless buildings' parts
export const french_detailless_bldg_fill = {
    "name": "French detailless building fill",
    ...french_fill_common_props,
    filter: ["==", ["get", "is_selectable"], false]
}
export const french_detailful_bldg_fill = {
    "name": "French detailful building",
    ...french_fill_common_props,
    props_when_selected: {
        "paint": {
            "fill-color": c.FRENCH_SELECTED_FILL_COLOR
        }
    },
    filter: ["==", ["get", "is_selectable"], true]
}



const FRENCH_POLYGONS_MAX_THICKENING = 0.7

const french_thickening_outline_common_props = {
    'type': 'line',
    "source": SOURCES_NAMES.CITY_TILES,
    "source-layer": "french_building",
    'paint': {
        'line-color': c.FRENCH_FILL_COLOR,
        'line-width': [
            "interpolate",
            ["linear"],
            ["zoom"],
            14,
            FRENCH_POLYGONS_MAX_THICKENING,
            15.5,
            0
        ]
    },
}

export const french_detailless_thickening_outline = {
    name: 'French bldg without details thickening outline',
    ...french_thickening_outline_common_props,
    filter: ["==", ["get", "is_selectable"], false],
}

export const french_detailful_thickening_outline = {
    name: 'French bldg with details thickening outline',
    ...french_thickening_outline_common_props,
    filter: ["==", ["get", "is_selectable"], true]
}

const get_dark_outline_props = high_zoom_thickness => {
    return {
        'type': 'line',
        "source": SOURCES_NAMES.CITY_TILES,
        "source-layer": "french_building",
        'paint': {
            'line-color': c.SELECTED_BORDER_COLOR,
            'line-width': [
                "interpolate",
                ["linear", 2],
                ["zoom"],
                // at low zoom, this outline has only visual purpose
                // (it's very narrow behind the thickening and adds some clarity to polygons)
                14,
                FRENCH_POLYGONS_MAX_THICKENING + 1,
                15.5,
                high_zoom_thickness
            ]
        },
        props_when_selected: {
            'paint': {
                'line-width': [
                    "interpolate",
                    ["linear", 2],
                    ["zoom"],
                    c.SELECTED_SQUARE_MAXZOOM,
                    4,
                    15.5,
                    6
                ]
            }
        }

    }
}

export const french_detailless_dark_outline = {
    'name': 'French buildings without details dark outline',
    ...get_dark_outline_props(1),
    filter: ["==", ["get", "is_selectable"], false],
}

export const french_detailful_dark_outline = {
    'name': 'French buildings with details dark outline',
    ...get_dark_outline_props(4),
    filter: ["==", ["get", "is_selectable"], true]
}