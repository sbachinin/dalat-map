import { SOURCES_NAMES } from "../constants.mjs"
import { FRENCH_SELECTED_FILL_COLOR } from "./constants.mjs"



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
    }
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
            'case',
            ['!=', ['feature-state', 'selected'], true],
            0,
            2.5
        ],
    },
    layout: {
        'line-join': 'round',
    }
}

export const layers_for_selected_feature = [selected_fill_layer, selected_border_layer]