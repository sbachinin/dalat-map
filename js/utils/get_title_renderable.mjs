import { get_midPoint_feature_with_text_rotate } from "../../build/get_midPoint_feature_with_text_rotate.mjs"
import { get_point_feature } from "./isomorphic_utils.mjs"

const hash_coordinates = coords => {
    // this works for arrays of varying depth
    // so it will hash both points and linestrings and polygons and hopefully multipolygons
    // For now it's an overkill because titles are always points
    // But just to avoid confusion later....
    const flat = JSON.stringify(coords)
    let hash = 0
    for (let i = 0; i < flat.length; i++) {
        const char = flat.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash |= 0 // Convert to 32-bit int
    }
    return hash >>> 0 // Unsigned
}

export const get_title_renderable = (
    text,
    coords,
    zoom_range,
    font,
    color,
    size,
) => {
    const layer = {
        id: `${text.replace(/\s/g, '_').replace(/\n/g, '_')}_title_${hash_coordinates(coords)}`,
        get_features: () => {
            // for a horizontally drawn title, pass a single point (coords = [x, y])
            // for a tilted title, pass two points ([[x,y], [x,y]]), in order to calculate the rotate angle for a point right btw them
            let feat = null
            if (typeof coords[0] === 'number') {
                feat = get_point_feature(coords)
            } else if (typeof coords[0][0] === 'number') {
                feat = get_midPoint_feature_with_text_rotate(coords[0], coords[1])
            } else {
                throw new Error('coords must be 1- or 2-dimensional array of numbers')
            }
            return [feat]
        },
        style_layers: [
            {
                type: 'symbol',
                layout: {
                    "text-field": text,
                    'text-size': size,
                    'text-font': [font],
                    'text-rotate': ["get", "text_rotate"],
                },
                paint: {
                    'text-color': color
                },
                drawing_importance: 0,
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
