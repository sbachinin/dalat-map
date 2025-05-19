import { get_point_feature } from "./isomorphic_utils.mjs"

export const get_title_renderable = (
    text,
    coords,
    zoom_range,
    font,
    color,
    size,
    rotate = 0
) => {
    const layer = {
        id: `${text.replace(/\s/g, '_').replace(/\n/g, '_')}_title_${String(coords[0]).replace('.', '_')}_${String(coords[1]).replace('.', '_')}`,
        get_features: () => ([
            get_point_feature(coords)
        ]),
        style_layers: [
            {
                type: 'symbol',
                layout: {
                    "text-field": text,
                    'text-size': size,
                    'text-font': [font],
                    'text-rotate': rotate
                },
                paint: {
                    'text-color': color
                },
            }
        ]
    }

    if (zoom_range[0]) {
        layer.style_layers[0].minzoom = zoom_range[0]
    }
    if (zoom_range[1]) {
        layer.style_layers[0].maxzoom = zoom_range[1]
    }

    return layer
}
