import { SELECTED_STYLE_LAYER_PREFIX } from "./select_building.mjs"
import { deep_merge_objects, pick } from "./utils/utils.mjs"
import { zoom_order } from "./zoom_order.mjs"

// zoom_order -> normal maplibre style layers
// + create selected layers and append them to the end
export const build_layers = () => {

    const selected_layers = []

    const main_layers = Object.entries(zoom_order)
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
        .sort((a, b) => { // TODO need thorough test
            return (b.drawing_importance ?? 1) - (a.drawing_importance ?? 1)
        })

    return [...main_layers, ...selected_layers]
}
