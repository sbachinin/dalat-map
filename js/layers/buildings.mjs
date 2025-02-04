import {
    BORING_BLDG_FILL_COLOR,
    CITY_BULK_DISAPPEARANCE_ZOOM,
    DARKER_FRENCH_FILL_COLOR,
    FIRST_DETAILS_MINZOOM,
    FRENCH_BORDER_COLOR,
    FRENCH_FILL_COLOR,
    FRENCH_SELECTED_FILL_COLOR,
    IMPORTANT_BORING_BLDG_FILL_COLOR,
    PALE_TITLES_COLOR, PALE_TITLES_SIZE,
    VARYING_TITLE_OPACITY
} from "./constants.mjs"

const french_geometry_minzoom = 13.3

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
                IMPORTANT_BORING_BLDG_FILL_COLOR,
                BORING_BLDG_FILL_COLOR
            ],
            "fill-antialias": true,
        }
    }
]

const french_building_fill = {
    "id": "French building",
    "type": "fill",
    "source": "dalat-tiles",
    "source-layer": "french_building",
    "minzoom": french_geometry_minzoom,
    "paint": {
        "fill-color": [
            "interpolate",
            ["linear"],
            ["zoom"],
            french_geometry_minzoom,
            DARKER_FRENCH_FILL_COLOR,
            CITY_BULK_DISAPPEARANCE_ZOOM,
            [
                'case',
                ['==', ['feature-state', 'selected'], true],
                FRENCH_SELECTED_FILL_COLOR,
                FRENCH_FILL_COLOR
            ]
        ],
        "fill-antialias": true
    },
}

const french_thickening_outline = {
    'id': 'French thickening outline',
    'type': 'line',
    "source": "dalat-tiles",
    "source-layer": "french_building",
    "minzoom": french_geometry_minzoom,
    'paint': {
        'line-color': [
            "interpolate",
            ["linear"],
            ["zoom"],
            french_geometry_minzoom - 1, // when french just appear, a slightly darker border makes them more substantial
            DARKER_FRENCH_FILL_COLOR,
            CITY_BULK_DISAPPEARANCE_ZOOM,
            FRENCH_FILL_COLOR
        ],
        'line-width': [
            "interpolate",
            ["linear"],
            ["zoom"],
            french_geometry_minzoom,  // Zoom level at which line-width should start decreasing
            1,   // line-width at french_geometry_minzoom
            16,  // Zoom level just above french_geometry_minzoom
            0    // line-width at zoom level 15 and higher
        ]
    },
}

const french_has_details_outline = {
    'id': 'French has-details outline',
    'type': 'line',
    "source": "dalat-tiles",
    "source-layer": "french_building",
    "minzoom": 14,
    'paint': {
        'line-color': [
            'case',
            ['boolean', ['feature-state', 'hasDetails'], false],
            FRENCH_BORDER_COLOR,
            'transparent',
        ],
        'line-width': [
            "interpolate",
            ["linear", 2],
            ["zoom"],
            14, 0.5,
            15.5, 2
        ]
    },
}

const french_titles_text_color = 'hsl(300, 20%, 25.40%)'

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
        "text-opacity": VARYING_TITLE_OPACITY
    }
}

export const french_titles_common_props = {
    layout: {
        'text-size': 11,
        'text-font': ['Merriweather Italic']
    },
    paint: {
        'text-color': french_titles_text_color
    }
}

export const shit_titles_common_props = {
    layout: {
        'text-size': PALE_TITLES_SIZE,
        'text-font': ['Lato Regular']
    },
    paint: {
        'text-color': PALE_TITLES_COLOR
    }
}



export const french_buildings_titles = {
    "id": "French buildings titles",
    "type": "symbol",
    "source": "buildings_titles",
    minzoom: french_geometry_minzoom,
    layout: {
        ...all_titles_common_props.layout,
        'text-size': french_titles_common_props.layout['text-size'],
        'text-font': french_titles_common_props.layout['text-font']
    },
    paint: {
        ...all_titles_common_props.paint,
        'text-color': french_titles_common_props.paint['text-color'],
    },
    filter: ['==', ['get', 'is_french'], true]
}

export const shit_buildings_titles = {
    "id": "Shit buildings titles",
    "type": "symbol",
    "source": "buildings_titles",
    minzoom: french_geometry_minzoom,
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
    minzoom: FIRST_DETAILS_MINZOOM,
    maxzoom: french_geometry_minzoom
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
        "icon-size": 0.6,
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
    french_building_fill,
    french_thickening_outline,
    french_has_details_outline
]