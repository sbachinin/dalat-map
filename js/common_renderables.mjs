import { get_Point_at_center } from "../build/get_Point_at_center.mjs"
import { dead_buildings_drawing_layers } from "./common_drawing_layers/dead_buildings_drawing_layers.mjs"

export const get_dead_buildings_renderable = dead_buildings_features => {
    return {
        id: 'Dead_buildings',
        get_features: () => {
            return [
                ...dead_buildings_features,
                ...dead_buildings_features.map(get_Point_at_center)
            ]
        },
        style_layers: dead_buildings_drawing_layers
    }
}