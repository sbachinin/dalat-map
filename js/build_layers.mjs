import { zoom_order } from "./zoom_order.mjs"

// zoom_order -> normal maplibre style layers
export const build_layers = () => {
    return Object.entries(zoom_order)
        .sort((a, b) => Number(b[0]) - Number(a[0]))
        .flatMap(([zoom_level, zoom_level_layers]) => {
            return zoom_level_layers.flatMap(zoom_level_layer => {
                return zoom_level_layer.drawing_layers.map(drawing_layer => {
                    if (!drawing_layer.name) {
                        throw new Error('no "name" for drawing layer!', drawing_layer)
                    }
                    const layer = {
                        id: zoom_level + ": " + drawing_layer.name,
                        minzoom: +zoom_level,
                        drawing_importance: zoom_level_layer.drawing_importance,
                        ...drawing_layer,
                    }
                    if (zoom_level_layer.maxzoom) {
                        layer.maxzoom = zoom_level_layer.maxzoom
                    }
                    return layer
                })
            })
        })
        .sort((a, b) => { // TODO need thorough test
            return (b.drawing_importance ?? 1) - (a.drawing_importance ?? 1)
        })
}
