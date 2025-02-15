import { SOURCES_NAMES } from "../sources.mjs"
import * as c from "./constants.mjs"

// show important french buildings from lowest z,
// show unimportant french buildings from "secondary" minZ
const zoom_filter = [
    "any",
    [">=", ["zoom"], c.SECONDARY_BLDGS_MINZOOM],
    [
        "all",
        ["==", ["get", "is_important"], true],
        ["==", ["get", "has_title"], true]
    ]
]

const get_filter = ({ must_have_details }) => {
    return [
        "all",
        zoom_filter,
        ["==", ["get", "has_details"], must_have_details]
    ]
}

const french_fill_common_props = {
    "type": "fill",
    "source": SOURCES_NAMES.DALAT_TILES,
    "source-layer": "french_building",
    "minzoom": c.FIRST_DETAILS_MINZOOM,
    "paint": {
        "fill-color": [
            'case',
            ['==', ['feature-state', 'selected'], true],
            c.FRENCH_SELECTED_FILL_COLOR,
            c.FRENCH_FILL_COLOR
        ],
        "fill-antialias": true
    },
}

const french_unimportant_building_fill = {
    "id": "French unimportant building fill",
    ...french_fill_common_props,
    filter: get_filter({ must_have_details: false })
}

export const french_important_building_fill = {
    "id": "French important building",
    ...french_fill_common_props,
    filter: get_filter({ must_have_details: true })
}

const FRENCH_POLYGONS_MAX_THICKENING = 0.7

const french_thickening_outline_common_props = {
    'type': 'line',
    "source": SOURCES_NAMES.DALAT_TILES,
    "source-layer": "french_building",
    "minzoom": c.FIRST_DETAILS_MINZOOM,
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

const french_without_details_thickening_outline = {
    id: 'French bldg without details thickening outline',
    ...french_thickening_outline_common_props,
    filter: get_filter({ must_have_details: false })
}

export const french_with_details_thickening_outline = {
    id: 'French bldg with details thickening outline',
    ...french_thickening_outline_common_props,
    filter: get_filter({ must_have_details: true })
}

const get_dark_outline_props = high_zoom_thickness => {
    return {
        'type': 'line',
        "source": SOURCES_NAMES.DALAT_TILES,
        "source-layer": "french_building",
        "minzoom": c.FIRST_DETAILS_MINZOOM,
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

const french_without_details_dark_outline = {
    'id': 'French buildings without details dark outline',
    ...get_dark_outline_props(0.8),
    filter: get_filter({ must_have_details: false })
}

export const french_with_details_dark_outline = {
    'id': 'French buildings with details dark outline',
    ...get_dark_outline_props(4),
    filter: get_filter({ must_have_details: true })
}

export const french_polygons_layers = [
    // detailless bldgs go first
    // because otherwise it can cover
    // the adjacent important buildings' outlines
    // leading to "missing borders" appearance
    french_without_details_dark_outline,
    french_without_details_thickening_outline,
    french_unimportant_building_fill,

    french_with_details_dark_outline,
    french_with_details_thickening_outline,
    french_important_building_fill
]