import { water_areas_fill } from "../js/drawing_layers.mjs";
import { city_bulk_border } from "../js/layers/other_layers.mjs";

export const zoom_order = {
    0: [
        {
            drawing_layers: [water_areas_fill],
            drawing_importance: 5
        },

        {
            drawing_layers: [city_bulk_border],
            drawing_importance: 1
        }
    ]
}