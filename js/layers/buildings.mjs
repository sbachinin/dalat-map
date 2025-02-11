import * as c from "./constants.mjs"


export const boring_building_layers = [

    {
        "id": "Boring building",
        "type": "fill",
        "source": "dalat-tiles",
        "source-layer": "boring_building",
        "minzoom": 14,
        "paint": {
            "fill-color": [
                "case",
                ["boolean", ["get", "has_title"], false],
                c.IMPORTANT_BORING_BLDG_FILL_COLOR,
                c.BORING_BLDG_FILL_COLOR
            ],
            "fill-antialias": true,
        }
    }
]

const french_fill_common_props = {
    "type": "fill",
    "source": "dalat-tiles",
    "source-layer": "french_building",
    "minzoom": c.FRENCH_GEOMETRY_MINZOOM,
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
    filter: ["==", ["coalesce", ["get", "has_details"], false], false]
}

const french_important_building_fill = {
    "id": "French important building",
    ...french_fill_common_props,
    filter: ["==", ["coalesce", ["get", "has_details"], false], true]
}

const FRENCH_POLYGONS_MAX_THICKENING = 0.7

const french_thickening_outline_common_props = {
    'type': 'line',
    "source": "dalat-tiles",
    "source-layer": "french_building",
    "minzoom": c.FRENCH_GEOMETRY_MINZOOM,
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
    filter: ["==", ["coalesce", ["get", "has_details"], false], false]
}

const french_with_details_thickening_outline = {
    id: 'French bldg with details thickening outline',
    ...french_thickening_outline_common_props,
    filter: ["==", ["coalesce", ["get", "has_details"], false], true]
}

const get_dark_outline_props = high_zoom_thickness => {
    return {
        'type': 'line',
        "source": "dalat-tiles",
        "source-layer": "french_building",
        "minzoom": c.FRENCH_GEOMETRY_MINZOOM,
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
    filter: ["==", ["coalesce", ["get", "has_details"], false], false]
}

const french_with_details_dark_outline = {
    'id': 'French buildings with details dark outline',
    ...get_dark_outline_props(3),
    filter: ["==", ["coalesce", ["get", "has_details"], false], true]
}


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



export const french_buildings_titles = {
    "id": "French buildings titles",
    "type": "symbol",
    "source": "buildings_titles",
    minzoom: c.FRENCH_GEOMETRY_MINZOOM,
    layout: {
        ...all_titles_common_props.layout,
        'text-size': french_titles_common_props.layout['text-size'],
        'text-font': french_titles_common_props.layout['text-font']
    },
    paint: {
        ...all_titles_common_props.paint,
        'text-color': french_titles_common_props.paint['text-color'],
        "text-halo-color": [
            "case",
            ['==', ['feature-state', 'selected'], true],
            c.FRENCH_SELECTED_TITLE_HALO_COLOR,
            'transparent'
        ],
        "text-halo-width": 5,
        "text-halo-blur": 0
    },
    filter: ['==', ['get', 'is_french'], true]
}

export const shit_buildings_titles = {
    "id": "Shit buildings titles",
    "type": "symbol",
    "source": "buildings_titles",
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
    source: "buildings_tiny_squares",
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
        'text-color': french_titles_common_props.paint['text-color']
    },
    filter: ['==', ['get', 'is_french'], true]
}

export const shit_buildings_tiny_squares_with_titles = {
    id: 'Shit building tiny squares with titles',
    type: 'symbol',
    source: "buildings_tiny_squares",
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

export const buildings_layers = [
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