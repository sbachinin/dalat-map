import { pick } from "./utils/isomorphic_utils.mjs"
import { zoom_order as common_zoom_order } from "./common_zoom_order.mjs"
import { current_city } from "./load_city.mjs"
import { SOURCES_NAMES } from "./constants.mjs"
import { FRENCH_SELECTED_FILL_COLOR, FRENCH_SELECTED_TITLE_HALO_COLOR } from "./common_drawing_layers/constants.mjs"

const join_style_filters = (...filters) => {
    // depending on the number of truthy filters, returns ["all", ...] OR the_only_truthy_one OR null
    const truthy_filters = filters.filter(Boolean)
    if (truthy_filters.length === 1) {
        return truthy_filters[0]
    }
    if (truthy_filters.length > 1) {
        return ["all", ...truthy_filters]
    }
    return null
}

const inject_city_constants = (input /* style_layer or any of its values */) => {
    if (Array.isArray(input)) {
        return input.map(item => inject_city_constants(item))
    } else if (typeof input === 'object' && input !== null) {
        for (const key in input) {
            input[key] = inject_city_constants(input[key])
        }
        return input
    } else if (typeof input === 'string' && input.startsWith('$$_')) {
        const key = input.slice(3)
        return current_city.constants[key]
    } else {
        return input
    }
}

const merge_zoom_order = (zo1, zo2) => { // common + city-specific zoom_order    
    /* 
        For each "zoom group" (array of "zoom layers"),
        gather all items from both common and city
    */
    const all_zoom_levels = [...new Set([...Object.keys(zo1), ...Object.keys(zo2)])].sort()
    const result = {}
    all_zoom_levels.forEach(zl => {
        result[zl] = [
            ...(zo1[zl] || []),
            ...(zo2[zl] || [])
        ]
    })
    return result
}

// zoom_order -> normal maplibre style layers
// + create selected layers and append them to the end
export const build_layers = () => {
    const zo = merge_zoom_order(common_zoom_order, current_city.zoom_order)
    const layers_from_zoom_order = Object.entries(zo)
        .sort((a, b) => Number(b[0]) - Number(a[0]))
        .flatMap(([zoom_level, zoom_level_layers]) => {
            return zoom_level_layers.flatMap(zoom_level_layer => {
                return zoom_level_layer.drawing_layers.map(drawing_layer => {
                    if (!drawing_layer.name) {
                        throw new Error('no "name" for drawing layer!', drawing_layer)
                    }
                    if (drawing_layer.id) {
                        console.warn('drawing layer has an id, this is suspicious because drawing layer must have "name" instead of id')
                    }

                    const style_layer = {
                        id: `${zoom_level}: ${drawing_layer.name}`,
                        minzoom: +zoom_level,
                        ...pick(drawing_layer, ['source', 'source-layer', 'type', 'layout', 'paint', 'selectable']),
                    }

                    if (zoom_level_layer.maxzoom) {
                        style_layer.maxzoom = zoom_level_layer.maxzoom
                    }

                    const maybe_filter = join_style_filters(zoom_level_layer.filter, drawing_layer.filter)
                    if (maybe_filter !== null) {
                        style_layer.filter = maybe_filter
                    }

                    style_layer.drawing_importance = zoom_level_layer.drawing_importance

                    return style_layer
                })
            })
        })

    const layers_from_renderables = current_city.renderables.flatMap(r => {
        return r.style_layers.map(sl => ({
            ...sl,
            id: r.id + " " + sl.type,
            source: SOURCES_NAMES.RENDERABLES,
            filter: join_style_filters(sl.filter, ["==", ["get", "renderable_id"], r.id])
        }))
    })

    const get_drawing_importance = l => {
        if (!l.drawing_importance) {
            if (l.type === 'symbol') {
                return 0
            }
            return Infinity
        }
        return l.drawing_importance
    }

    current_city.sources_of_selectable_features = []

    const all_layers = ([...layers_from_zoom_order, ...layers_from_renderables])
        .map(adjust_props_for_selectable_symbol_layer)

    current_city.sources_of_selectable_features = all_layers
        .filter(l => l.selectable)
        .map(l => ({
            source: l.source,
            sourceLayer: l['source-layer']
        }))
        .filter((l, i, arr) => arr.findIndex(l2 => l2.source === l.source && l2.sourceLayer === l.sourceLayer) === i)

    const selected_layers = all_layers
        .filter(l => l.selectable && l.type === 'fill')
        .flatMap(derive_selected_variants_for_selectable_fill)

    return all_layers.concat(selected_layers)
        .sort((a, b) => {
            return get_drawing_importance(b) - get_drawing_importance(a)
        })
        .map(inject_city_constants)
}






function adjust_props_for_selectable_symbol_layer(layer) {
    if (layer.type === 'symbol' && layer.selectable) {
        layer.paint['text-halo-color'] = [
            "case",
            ['==', ['feature-state', 'selected'], true],
            FRENCH_SELECTED_TITLE_HALO_COLOR,
            'transparent'
        ]
        layer.paint['text-halo-width'] = 5
        layer.paint['text-halo-blur'] = 0
    }
    return layer
}


function derive_selected_variants_for_selectable_fill(base_layer) {

    // dedicated selected fill and border layers are created only for "fill" base layer
    // otherwise it would be harder to avoid duplicates in selected []
    const line_layer = {
        drawing_importance: 2,
        id: base_layer.id + ' selected border',
        type: 'line',
        source: base_layer.source,
        paint: {
            'line-color': 'hsl(340, 89%, 22%)',
            'line-width': [
                "interpolate",
                ["linear"],
                ["zoom"],
                13,
                [
                    "case",
                    ['==', ['feature-state', 'selected'], true],
                    4,
                    0
                ],
                15.5,
                [
                    "case",
                    ['==', ['feature-state', 'selected'], true],
                    1.5,
                    0
                ],
            ]
        },
        layout: {
            'line-join': 'round',
        }
    }

    /* Creating the following "fill" layer ALMOST could be avoided,
        and worked around by ["case", ... "selected" ...] block in base fill layer.
        But base fill layer can disappear sooner than the selected border "closes" (eats all the space within it with its thickness),
        and so for some zoom range the border would have empty space inside it
    */

    const fill_layer = {
        drawing_importance: base_layer.drawing_importance, // it will come after base layer, so will will be rendered on top
        id: base_layer.id + ' selected',
        type: 'fill',
        source: base_layer.source,
        paint: {
            ...base_layer.paint,
            'fill-color': [
                "case",
                ['==', ['feature-state', 'selected'], true],
                FRENCH_SELECTED_FILL_COLOR,
                'transparent'
            ],
        },
    }
    if (base_layer['source-layer']) {
        line_layer['source-layer'] = base_layer['source-layer']
        fill_layer['source-layer'] = base_layer['source-layer']
    }
    if (base_layer.filter) {
        line_layer.filter = base_layer.filter
        fill_layer.filter = base_layer.filter
    }

    return [fill_layer, line_layer]
}