import { SOURCES_NAMES } from "../constants.mjs"
import { FRENCH_GEOMETRIES_MINZOOM, FRENCH_SELECTED_FILL_COLOR } from "./constants.mjs"



// selected title will disappear for now
/* 
        layer.paint['text-halo-color'] = [
            "case",
            ['==', ['feature-state', 'selected'], true],
            FRENCH_SELECTED_TITLE_HALO_COLOR,
            'transparent'
        ]
        layer.paint['text-halo-width'] = 5
        layer.paint['text-halo-blur'] = 0
 */


const selected_fill_layer = {
    drawing_importance: 1, // it will come after base layer, so will will be rendered on top
    id: 'Selected feature fill',
    type: 'fill',
    source: SOURCES_NAMES.CITY_TILES,
    'source-layer': 'selectable_polygons',
    paint: {
        "fill-color": [
            'case',
            ['!=', ['feature-state', 'selected'], true],
            'transparent',
            FRENCH_SELECTED_FILL_COLOR
        ],
        "fill-antialias": true
    },
    minzoom: FRENCH_GEOMETRIES_MINZOOM
}



const selected_thickening_outline = {
    drawing_importance: 1,
    id: 'Selected feature thickening outline',
    type: 'line',
    source: SOURCES_NAMES.CITY_TILES,
    'source-layer': 'selectable_polygons',
    paint: {
        'line-color': FRENCH_SELECTED_FILL_COLOR,
        'line-width': 1,
        'line-opacity': [
            'case',
            ['!=', ['feature-state', 'selected'], true],
            0,
            1
        ]
    },
    layout: {
        'line-join': 'miter',
    },
    minzoom: FRENCH_GEOMETRIES_MINZOOM
}


const selected_border_layer = {
    drawing_importance: 1,
    id: 'Selected feature border',
    type: 'line',
    source: SOURCES_NAMES.CITY_TILES,
    'source-layer': 'selectable_polygons',
    paint: {
        'line-color': 'hsl(340, 89%, 22%)',
        'line-width': [
            'interpolate', ['linear'], ['zoom'],
            FRENCH_GEOMETRIES_MINZOOM, 3,
            15, 4
        ],
        'line-opacity': [
            'case',
            ['!=', ['feature-state', 'selected'], true],
            0,
            1
        ]
    },
    layout: {
        'line-join': 'miter',
    },
    minzoom: FRENCH_GEOMETRIES_MINZOOM
}

const selected_pin_layer = {
    drawing_importance: 0,
    id: 'Selected feature pin',
    type: 'symbol',
    source: 'selected_centroid_pin_point',
    layout: {
        'icon-image': 'pin',
        'icon-size': 0.8,
        'icon-anchor': 'bottom',
        'icon-allow-overlap': false
    },
    // Idea: pin shouldn't show together with buildings polygons because it didn't look nice
    maxzoom: FRENCH_GEOMETRIES_MINZOOM
}

export const layers_for_selected_feature = [
    selected_border_layer,
    selected_fill_layer,
    selected_thickening_outline,
    selected_pin_layer
]