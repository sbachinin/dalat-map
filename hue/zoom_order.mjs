import { water_areas_fill } from "../js/drawing_layers.mjs";
import { city_walls_fill, city_walls_thickening_outline } from "./drawing_layers.mjs";

export const zoom_order = {
    0: [
        {
            drawing_layers: [water_areas_fill],
            filter: ["!=", ["get", "is_small_lake"], true],
            drawing_importance: 5
        },
        {
            drawing_layers: [city_walls_fill, city_walls_thickening_outline],
            drawing_importance: 2
        }
    ],
    13: [
        {
            drawing_layers: [water_areas_fill],
            filter: ["==", ["get", "is_small_lake"], true],
            drawing_importance: 5
        },
    ]
}