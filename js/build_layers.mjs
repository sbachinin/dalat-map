import { pick } from "./utils/isomorphic_utils.mjs"
import { zoom_order as common_zoom_order } from "./common_zoom_order.mjs"
import { current_city } from "./load_city.mjs"
import { SOURCES_NAMES, TTTLES_MAIN_TILE_LAYER } from "./constants.mjs"
import { make_roads_layers } from "./common_drawing_layers/make_roads_layers.mjs"
import { layers_for_selected_feature } from "./common_drawing_layers/layers_for_selected_feature.mjs"
import { dead_buildings_layers } from "./common_drawing_layers/dead_buildings.mjs"
import { selectable_border, selected_text_halo_props } from "./common_drawing_layers/drawing_layers.mjs"
import { DR_IM } from "./common_drawing_layers/drawing_importance.mjs"
import { NON_SELECTABLE_TITLE_OPACITY } from "./common_drawing_layers/constants.mjs"

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
export const build_layers = () => {
    const zo = merge_zoom_order(common_zoom_order, current_city.zoom_order)
    const layers_from_zoom_order = Object.entries(zo)
        .sort((a, b) => Number(b[0]) - Number(a[0]))
        .flatMap(([zoom_level, zoom_level_layers]) => {
            return zoom_level_layers.flatMap(zoom_level_layer => {
                return zoom_level_layer.drawing_layers.map(drawing_layer => {
                    drawing_layer = structuredClone(drawing_layer)
                    if (!drawing_layer.name) {
                        throw new Error('no "name" for drawing layer!', drawing_layer)
                    }

                    if (
                        drawing_layer.type === 'symbol'
                        && drawing_layer.layout['text-field']
                        && drawing_layer['source-layer'] !== TTTLES_MAIN_TILE_LAYER
                        && !drawing_layer.allow_different_title_source // ###7
                    ) {
                        throw new Error(`Trying to render titles from a source-layer other than TTTLES_MAIN_TILE_LAYER: ${drawing_layer.name}. To override this limitation, set allow_different_title_source property on a style layer`)
                    }

                    if (drawing_layer.id) {
                        console.warn('drawing layer has an id, this is suspicious because drawing layer must have "name" instead of id')
                    }

                    const style_layer = {
                        id: `${zoom_level}: ${drawing_layer.name}`,
                        minzoom: +zoom_level,
                        ...pick(drawing_layer, ['source', 'source-layer', 'type', 'layout', 'paint', 'drawing_importance']),
                    }

                    if (zoom_level_layer.maxzoom) {
                        style_layer.maxzoom = zoom_level_layer.maxzoom
                    }

                    const maybe_filter = join_style_filters(zoom_level_layer.filter, drawing_layer.filter)
                    if (maybe_filter !== null) {
                        style_layer.filter = maybe_filter
                    }

                    // Commented out because drawing_importance was moved to style (or "drawing") layers.
                    // It could be nice to be able to override d_i in zoom_order. But it can also introduce more chaos. + There is no use case for this right now
                    // if (zoom_level_layer.drawing_importance) style_layer.drawing_importance = zoom_level_layer.drawing_importance

                    return style_layer
                })
            })
        })

    const layers_from_renderables = current_city.renderables.flatMap(r => {
        return r.style_layers
            .map(sl => structuredClone(sl))
            .map(sl => {
                const result = {
                    ...sl,
                    id: r.id + " " + sl.type,
                    source: SOURCES_NAMES.RENDERABLES,
                    filter: join_style_filters(sl.filter, ["==", ["get", "renderable_id"], r.id]),
                }

                if (
                    sl.type === 'symbol'
                    && sl.layout['text-field']
                    && !sl.paint['text-opacity']
                ) {
                    // Renderable should be dumb and non-selectable, therefore bleak,
                    // Unless text-opacity is explicitly set in particular renderable
                    result.paint['text-opacity'] = NON_SELECTABLE_TITLE_OPACITY
                }
                return result
            })
    })

    const get_drawing_importance = l => {
        if (!l.drawing_importance) {
            if (l.type === 'symbol') {
                return DR_IM.TITLES
            }
            return Infinity
        }
        return l.drawing_importance
    }

    const all_layers = ([
        ...make_roads_layers(),
        ...layers_from_renderables,
        ...layers_from_zoom_order,
    ])

    if (Object.values(current_city.features_generated_props_for_frontend).find(v => v.is_dead)) {
        all_layers.push(...dead_buildings_layers)
    }

    return all_layers
        .concat([selectable_border])
        .concat(layers_for_selected_feature)
        .sort((a, b) => {
            return get_drawing_importance(b) - get_drawing_importance(a)
        })
        .map(inject_city_constants)
        .map(add_selected_halo_props_for_texts)
        .map(add_text_opacity)
}


function add_selected_halo_props_for_texts(l) {
    if (
        l.type === 'symbol'
        && l.layout['text-field']
    ) {
        return {
            ...l,
            paint: {
                ...l.paint,
                ...selected_text_halo_props
            }
        }
    }
    return l
}

function add_text_opacity(l) {
    if (
        l['source-layer'] === TTTLES_MAIN_TILE_LAYER
        && l.type === 'symbol'
        && l.layout['text-field']
    ) {
        return {
            ...l,
            paint: {
                'text-opacity': [
                    'case',
                    ['==', ['get', 'is_selectable'], true],
                    1,
                    NON_SELECTABLE_TITLE_OPACITY
                ],
                ...l.paint,
            }
        }
    }
    return l
}