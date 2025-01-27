const french_color = 'hsl(300, 35%, 60%)'
const french_highlighted_color = 'hsl(35, 97.80%, 63.50%)'
const frenchBorderColor = 'hsl(265, 35.30%, 50.00%)'
const boringBuildingColor = 'hsl(43, 15%, 90%)'
const french_geometry_minzoom = 13.3

export const boring_building_layers = [

    {
        "id": "Boring building",
        "type": "fill",
        "source": "dalat-tiles",
        "source-layer": "boring_building",
        "minzoom": 14,
        "paint": {
            "fill-color": boringBuildingColor,
            "fill-antialias": true,
        },
        filter: ["!=", "name", "Big C"]
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
            'case',
            ['==', ['feature-state', 'selected'], true],
            french_highlighted_color,
            french_color,
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
        'line-color': french_color,
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
            frenchBorderColor,
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

const french_titles_text_color = 'hsl(300, 20%, 20.40%)'
const non_french_titles_text_color = 'hsl(0, 0.00%, 40.40%)'

const all_titles_common_props = {
    layout: {
        "text-field": ["get", "title"],
        "text-anchor": "top",
        "text-offset": [0, 0.2],
        "symbol-sort-key": ["get", "priority"],
    },
    paint: {

    }
}

const french_titles_common_props = {
    layout: {
        'text-size': 12,
        'text-font': ['Libre Bodoni Italic']
    },
    paint: {
        'text-color': french_titles_text_color
    }
}

const shit_titles_common_props = {
    layout: {
        'text-size': 11,
        'text-font': ['Lato Regular']
    },
    paint: {
        'text-color': non_french_titles_text_color
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
        'text-color': french_titles_common_props.paint['text-color']
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
    minzoom: 12.2,
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
    filter: ['==', ['get', 'is_french'], false]
}

export const buildings_layers = [
    french_building_fill,
    french_thickening_outline,
    french_has_details_outline
]