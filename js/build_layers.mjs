import { SELECTED_STYLE_LAYER_PREFIX } from "./select_building.mjs"
import { deep_merge_objects, pick } from "./utils/isomorphic_utils.mjs"
import { zoom_order as common_zoom_order } from "./common_zoom_order.mjs"
import { current_city } from "./load_city.mjs"
import { SOURCES_NAMES } from "./constants.mjs"
import { selected_square } from "./common_drawing_layers/drawing_layers.mjs"
import { SELECTED_SQUARE_MAXZOOM } from "./common_drawing_layers/constants.mjs"

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
                        ...pick(drawing_layer, ['source', 'source-layer', 'type', 'layout', 'paint', 'props_when_selected']),
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
    const base_layers = ([...layers_from_zoom_order, ...layers_from_renderables])
        .sort((a, b) => {
            return get_drawing_importance(b) - get_drawing_importance(a)
        })

    const selected_layers = base_layers
        .filter(l => !!l.props_when_selected)
        .map(base_layer => deep_merge_objects(
            base_layer,
            {
                id: `${SELECTED_STYLE_LAYER_PREFIX} ${base_layer.id}`,
                minzoom: SELECTED_SQUARE_MAXZOOM,
                paint: deep_merge_objects(base_layer.paint, base_layer.props_when_selected.paint),
                layout: deep_merge_objects(base_layer.layout, base_layer.props_when_selected.layout),
                filter: join_style_filters(
                    base_layer.filter,
                    ["==", ["id"], 'nonexistent_id'] // hide everything selected for a start
                )
            }
        ))

    return ([...base_layers, ...selected_layers, selected_square])
        .map(layer => ({ ...layer, drawing_importance: undefined, props_when_selected: undefined }))
        .map(inject_city_constants)
}
