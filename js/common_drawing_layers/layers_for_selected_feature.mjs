import { SOURCES_NAMES } from "../constants.mjs"
import { FRENCH_SELECTED_FILL_COLOR } from "./colors.mjs"
import { MAJOR_BUILDINGS_POLYGONS_MINZOOM } from "./constants.mjs"
import { DR_IM } from "./drawing_importance.mjs"


const selected_fill_layer = {
    drawing_importance: DR_IM.SELECTED_POLYGON, // it will come after base layer, so will will be rendered on top
    id: 'Selected feature fill',
    type: 'fill',
    source: SOURCES_NAMES.CITY_TILES,
    'source-layer': 'selectable_polygons',
    paint: {
        "fill-color": FRENCH_SELECTED_FILL_COLOR,
        "fill-antialias": true
    },
    minzoom: MAJOR_BUILDINGS_POLYGONS_MINZOOM,
    filter: ['==', '', 2]
}



const selected_thickening_outline = {
    drawing_importance: DR_IM.SELECTED_POLYGON,
    id: 'Selected feature thickening outline',
    type: 'line',
    source: SOURCES_NAMES.CITY_TILES,
    'source-layer': 'selectable_polygons',
    paint: {
        'line-color': FRENCH_SELECTED_FILL_COLOR,
        'line-width': 1
    },
    layout: {
        'line-join': 'miter',
    },
    minzoom: MAJOR_BUILDINGS_POLYGONS_MINZOOM,
    filter: ['==', '', 2]
}


const selected_border_layer = {
    drawing_importance: DR_IM.SELECTED_POLYGON,
    id: 'Selected feature border',
    type: 'line',
    source: SOURCES_NAMES.CITY_TILES,
    'source-layer': 'selectable_polygons',
    paint: {
        'line-color': 'hsl(340, 89%, 22%)',
        'line-width': [
            'interpolate', ['linear'], ['zoom'],
            MAJOR_BUILDINGS_POLYGONS_MINZOOM, 3,
            15, 4
        ]
    },
    layout: {
        'line-join': 'miter',
    },
    minzoom: MAJOR_BUILDINGS_POLYGONS_MINZOOM,
    filter: ['==', '', 2]
}

export const pin_style_layer_id = 'Selected feature pin'

const selected_pin_layer = {
    drawing_importance: DR_IM.PIN,
    id: pin_style_layer_id,
    type: 'symbol',
    source: 'bldgs_centroids_points',
    layout: {
        'icon-image': 'pin',
        'icon-size': 0.8,
        'icon-anchor': 'bottom',
        'icon-allow-overlap': false
    },

    // Idea: pin shouldn't show together with buildings polygons because it didn't look nice
    maxzoom: MAJOR_BUILDINGS_POLYGONS_MINZOOM,

    filter: ['==', '', 2]
}

export const layers_for_selected_feature = [
    selected_border_layer,
    selected_fill_layer,
    selected_thickening_outline,
    selected_pin_layer
]