import { zoom_order } from "./zoom_order.mjs"

// zoom_order -> normal maplibre style layers
export const build_layers = () => {
    return Object.entries(zoom_order).map(([zoom_level, zoom_level_layers]) => {
        return zoom_level_layers.map(zoom_level_layer => {
            return zoom_level_layer.drawing_layers.map(drawing_layer => {
                return {
                    id: zoom_level + drawing_layer.name,
                    ...zoom_level_layer.selector,
                    minzoom: +zoom_level,
                    type: drawing_layer.type,
                    paint: drawing_layer.paint,
                    layout: drawing_layer.layout
                }
            }).flat()
        }).flat()
    }).flat()
}