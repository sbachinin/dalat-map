import { SELECTED_STYLE_LAYER_PREFIX } from "./select_building.mjs"
import { deep_merge_objects, pick } from "./utils/utils.mjs"
import { zoom_order as common_zoom_order } from "./common_zoom_order.mjs"
import { current_city } from "./load_city.mjs"
import { SOURCES_NAMES } from "./sources.mjs"

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

    const selected_layers = []

    const zo = merge_zoom_order(common_zoom_order, current_city.zoom_order)
    const main_layers = Object.entries(zo)
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

                    const final_main_layer = {
                        id: `${zoom_level}: ${drawing_layer.name}`,
                        minzoom: +zoom_level,
                        ...pick(drawing_layer, ['source', 'source-layer', 'type', 'layout', 'paint']),
                    }

                    if (zoom_level_layer.maxzoom) {
                        final_main_layer.maxzoom = zoom_level_layer.maxzoom
                    }
                    final_main_layer.filter = ["all"]
                    if (zoom_level_layer.filter) {
                        final_main_layer.filter.push(zoom_level_layer.filter)
                    }
                    if (drawing_layer.filter) {
                        final_main_layer.filter.push(drawing_layer.filter)
                    }

                    if (drawing_layer.props_when_selected) {
                        const sel_layer = deep_merge_objects(
                            final_main_layer,
                            {
                                ...drawing_layer.props_when_selected,
                                id: `${SELECTED_STYLE_LAYER_PREFIX} ${final_main_layer.id}`,
                                minzoom: 11,
                                filter: [
                                    ...final_main_layer.filter,
                                    ["==", ["id"], 'nonexistent_id']
                                ]
                            }
                        )
                        selected_layers.push(sel_layer)
                    }

                    final_main_layer.drawing_importance = zoom_level_layer.drawing_importance

                    return final_main_layer
                })
            })
        })
        .concat(current_city.renderables.map(r => {
            return {
                ...r.style_layer,
                id: r.id,
                source: SOURCES_NAMES.CITY_TILES,
                'source-layer': r.id
            }
        }))
        .sort((a, b) => { // TODO need thorough test
            return (b.drawing_importance ?? 1) - (a.drawing_importance ?? 1)
        })

    return [...main_layers, ...selected_layers]
}
