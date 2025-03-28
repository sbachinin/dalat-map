import { SOURCES_NAMES } from "../sources.mjs"
import * as c from "./constants.mjs"

export const french_fill_common_props = {
    "type": "fill",
    "source": SOURCES_NAMES.DALAT_TILES,
    "source-layer": "french_building",
    "paint": {
        "fill-color": c.FRENCH_FILL_COLOR,
        "fill-antialias": true
    },
}



// the following separation was necessary
// in order to render all detailful bldgs after all detailless,
// to prevent the detailful bldgs' border from being covered by borderless buildings' parts
const french_detailless_bldg_fill = {
    "id": "French unimportant building fill",
    ...french_fill_common_props,
    filter: ["==", ["get", "has_details"], false]
}
export const french_detailful_bldg_fill = {
    "id": "French important building",
    ...french_fill_common_props,
    filter: ["==", ["get", "has_details"], true]
}



const FRENCH_POLYGONS_MAX_THICKENING = 0.7

const french_thickening_outline_common_props = {
    'type': 'line',
    "source": SOURCES_NAMES.DALAT_TILES,
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

const french_detailless_thickening_outline = {
    id: 'French bldg without details thickening outline',
    ...french_thickening_outline_common_props,
    filter: ["==", ["get", "has_details"], false]
}

export const french_detailful_thickening_outline = {
    id: 'French bldg with details thickening outline',
    ...french_thickening_outline_common_props,
    filter: ["==", ["get", "has_details"], true]
}

const get_dark_outline_props = high_zoom_thickness => {
    return {
        'type': 'line',
        "source": SOURCES_NAMES.DALAT_TILES,
        "source-layer": "french_building",
        'paint': {
            'line-color': c.FRENCH_DARK_BORDER_COLOR,
            'line-width': [
                "interpolate",
                ["linear", 2],
                ["zoom"],
                // at low zoom, this outline has only visual purpose
                // (it's very narrow behind the thickening and adds some clarity to polygons)
                14,
                FRENCH_POLYGONS_MAX_THICKENING + 0.7,
                15.5,
                high_zoom_thickness
            ]
        }
    }
}

const french_detailless_dark_outline = {
    'id': 'French buildings without details dark outline',
    ...get_dark_outline_props(1),
    filter: ["==", ["get", "has_details"], false]
}

export const french_detailful_dark_outline = {
    'id': 'French buildings with details dark outline',
    ...get_dark_outline_props(4),
    filter: ["==", ["get", "has_details"], true]
}

const first_class_bldg_filter = ["all",
    ["==", ["get", "is_important"], true],
    ["==", ["get", "has_title"], true]
]
const non_first_class_bldg_filter = ["any",
    ["==", ["get", "is_important"], false],
    ["==", ["get", "has_title"], false]
]

export const french_polygons_layers = [
    // detailless bldgs go first
    // because otherwise it can cover
    // the adjacent important buildings' outlines
    // leading to "missing borders" appearance
    french_detailless_dark_outline,
    french_detailless_thickening_outline,
    french_detailless_bldg_fill,

    french_detailful_dark_outline,
    french_detailful_thickening_outline,
    french_detailful_bldg_fill
].flatMap(l => ([
    {
        ...l,
        id: l.id + ' - 1st class',
        filter: [
            "all",
            l.filter,
            first_class_bldg_filter
        ],
    },
    {
        ...l,
        id: l.id + ' - non-1st class',
        filter: [
            "all",
            l.filter,
            non_first_class_bldg_filter
        ],
        minzoom: c.SECONDARY_BLDGS_MINZOOM
    },


]))