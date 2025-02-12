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

export const french_titles_common_props = {
    layout: {
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
        'text-color': c.FRENCH_TITLES_TEXT_COLOR
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
    minzoom: c.FRENCH_GEOMETRY_MINZOOM,
    layout: {
        ...all_titles_common_props.layout,
        'text-size': french_titles_common_props.layout['text-size'],
        'text-font': french_titles_common_props.layout['text-font']
    },
    paint: {
        ...all_titles_common_props.paint,
        'text-color': french_titles_common_props.paint['text-color'],
        ...halo_if_selected
    },
    filter: ['==', ['get', 'is_french'], true]
}

export const shit_buildings_titles = {
    "id": "Shit buildings titles",
    "type": "symbol",
    "source": SOURCES_NAMES.BUILDING_TITLE,
    minzoom: c.FRENCH_GEOMETRY_MINZOOM,
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

const tiny_squares_zoom_levels = {
    minzoom: c.FIRST_DETAILS_MINZOOM,
    maxzoom: c.FRENCH_GEOMETRY_MINZOOM
}


export const french_buildings_tiny_squares_with_titles = {
    id: "French buildings tiny squares with titles",
    type: "symbol",
    source: SOURCES_NAMES.BUILDING_TITLE_WITH_SQUARE,
    ...tiny_squares_zoom_levels,
    layout: {
        ...all_titles_common_props.layout,
        'text-size': french_titles_common_props.layout['text-size'],
        'text-font': french_titles_common_props.layout['text-font'],
        "icon-image": "tiny_french_square",
        "icon-size": 0.4,
    },
    paint: {
        ...all_titles_common_props.paint,
        'text-color': french_titles_common_props.paint['text-color'],
        ...halo_if_selected
    },
    filter: ['==', ['get', 'is_french'], true]
}

export const shit_buildings_tiny_squares_with_titles = {
    id: 'Shit building tiny squares with titles',
    type: 'symbol',
    source: SOURCES_NAMES.BUILDING_TITLE_WITH_SQUARE,
    ...tiny_squares_zoom_levels,
    layout: {
        ...all_titles_common_props.layout,
        ...shit_titles_common_props.layout,
        "icon-image": "tiny_non_french_square",
        "icon-size": 0.4
    },
    paint: {
        ...all_titles_common_props.paint,
        ...shit_titles_common_props.paint
    },
    filter: [
        "all",
        ['==', ['get', 'is_french'], false],
        ['==', ['get', 'second_rate'], false]
    ]
}
