import { SOURCES_NAMES } from "../sources.mjs"
import * as c from "./constants.mjs"

export const all_titles_common_props = {
    layout: {
        "text-field": ["get", "title"],
        "text-anchor": ["case",
            ["==", ["get", "title_side"], "top"],
            "bottom",
            ["==", ["get", "title_side"], "right"],
            'left',
            "top"
        ],
        "text-offset": [
            "case",
            ["==", ["get", "title_side"], "top"],
            ["literal", [0, -0.2]],
            ["==", ["get", "title_side"], "right"],
            ["literal", [0.2, 0]],
            ["literal", [0, 0.2]]
        ],
        "symbol-sort-key": ["get", "priority"],
    },
    paint: {
        "text-opacity": c.VARYING_TITLE_OPACITY
    }
}

export const shit_titles_common_props = {
    layout: {
        'text-size': c.PALE_TITLES_SIZE,
        'text-font': ['Lato Regular']
    },
    paint: {
        'text-color': c.PALE_TITLES_COLOR
    }
}

const halo_if_selected = {
    "text-halo-color": [
        "case",
        ['==', ['feature-state', 'selected'], true],
        c.FRENCH_SELECTED_TITLE_HALO_COLOR,
        'transparent'
    ],
    "text-halo-width": 5,
    "text-halo-blur": 0
}

export const french_buildings_titles = {
    "id": "French buildings titles",
    "type": "symbol",
    "source": SOURCES_NAMES.BUILDING_TITLE,
    minzoom: c.FIRST_DETAILS_MINZOOM,
    layout: {
        ...all_titles_common_props.layout,
        'text-size': [
            "interpolate",
            ["linear"],
            ["zoom"],
            14,
            11,
            17.5,
            15
        ],
        'text-font': ['Merriweather Italic']
    },
    paint: {
        ...all_titles_common_props.paint,
        'text-color': c.FRENCH_TITLES_TEXT_COLOR,
        ...halo_if_selected
    },
    filter: ['==', ['get', 'is_french'], true]
}

export const shit_buildings_titles = {
    "id": "Shit buildings titles",
    "type": "symbol",
    "source": SOURCES_NAMES.BUILDING_TITLE,
    minzoom: c.SECONDARY_BLDGS_MINZOOM,
    layout: {
        ...all_titles_common_props.layout,
        ...shit_titles_common_props.layout
    },
    paint: {
        ...all_titles_common_props.paint,
        ...shit_titles_common_props.paint
    },
    filter: ['==', ['get', 'is_french'], false]
}
