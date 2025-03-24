import { SOURCES_NAMES } from "../sources.mjs"
import * as c from "./constants.mjs"

const min_zoom_filter = ["any",
    ["!", ["has", "min_zoom"]],
    ['<=', ['get', 'min_zoom'], ['zoom']]
]

export const all_titles_common_props = {
    layout: {
        "text-field": ["get", "title"],
        "text-anchor": [
            "case",
            ["==", ["get", "title_side"], "south"],
            "top",
            ["==", ["get", "title_side"], "north"],
            'bottom',
            "center"
        ],
        "text-offset": [
            "case",
            ["==", ["get", "title_side"], "north"],
            ["literal", [0, -0.2]],
            ["==", ["get", "title_side"], "south"],
            ["literal", [0, 0.2]],
            ["literal", [0, 0]]
        ],
        'symbol-sort-key': [
            "case",
            ['has', 'symbol-sort-key'],
            ['get', 'symbol-sort-key'],
            1
        ],
        'text-padding': 1
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
    filter: [
        "all",
        ['==', ['get', 'is_french'], true],
        min_zoom_filter
    ]
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
    filter: [
        "all",
        ['==', ['get', 'is_french'], false],
        min_zoom_filter
    ]
}


export const land_areas_titles = {
    id: 'Land areas titles',
    type: 'symbol',
    "source": "land_areas_titles",
    minzoom: 13, // TODO ok??
    layout: {
        ...all_titles_common_props.layout,
        ...shit_titles_common_props.layout,
        "text-anchor": 'center'
    },
    paint: {
        ...all_titles_common_props.paint,
        ...shit_titles_common_props.paint,
        "text-opacity": c.VARYING_TITLE_OPACITY
    },
    "filter": min_zoom_filter
}

export const peaks_triangles_with_titles = {
    id: 'Peaks triangles with titles',
    type: 'symbol',
    source: SOURCES_NAMES.DALAT_TILES,
    'source-layer': 'peaks',
    minzoom: c.FIRST_DETAILS_MINZOOM,
    layout: {
        "text-anchor": "top",
        "text-offset": [0, 0.3],
        'text-size': c.PALE_TITLES_SIZE,
        'text-font': ['Lato Regular'],
        "text-field": ["get", "ele"],
        "icon-image": "peak_triangle",
        "icon-size": 0.01,
    },
    paint: {
        'text-color': c.PEAK_TTTLE_COLOR
    },
    filter: min_zoom_filter
}


export const lakes_titles = {
    id: 'Lakes titles',
    type: 'symbol',
    "source": "lakes_titles",
    minzoom: 12.5,
    layout: {
        "text-field": ["get", "title"],
        'text-size': c.PALE_TITLES_SIZE,
        'text-font': ['Lato Regular']
    },
    paint: {
        'text-color': c.LAKE_TITLE_COLOR
    },
    filter: min_zoom_filter
}


export const city_bulk_title = {
    id: 'cityBulk title',
    type: 'symbol',
    source: SOURCES_NAMES.DALAT_TILES,
    "source-layer": 'dalat_bulk_geometry_as_linestring',
    minzoom: 14.2,
    layout: {
        'text-field': 'Approximate residential limits of Dalat',
        'text-size': c.PALE_TITLES_SIZE,
        'text-font': ['Lato Regular'],
        'symbol-placement': 'line',
        "symbol-spacing": 300,
        "text-offset": [0, 1],
        "text-letter-spacing": 0.1
    },
    paint: {
        'text-color': c.CITY_BULK_TITLE_COLOR
    }
}
