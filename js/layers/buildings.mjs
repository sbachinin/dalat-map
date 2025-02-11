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

const french_thickening_outline = {
    'id': 'French thickening outline',
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

// TODO maybe rename; it's just a border; it can be a replacement for thickening 
const french_has_details_outline = {
    'id': 'French has-details outline',
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
            15.5, [
                'case',
                ['boolean', ['feature-state', 'hasDetails'], false],
                3,
                0.8
            ]
        ]
    },
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
    // unimortant fill is extracted and goes first
    // because otherwise it can cover
    // the adjacent important buildings' outlines
    french_unimportant_building_fill,
    french_has_details_outline,
    french_thickening_outline,
    french_important_building_fill
]