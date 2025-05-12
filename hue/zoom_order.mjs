import { railway_line, water_areas_fill } from "../js/drawing_layers.mjs";
import { city_bulk_border, city_title, river_lines } from "../js/layers/common_drawing_layers.mjs";
import { city_walls_fill, city_walls_thickening_outline } from "./drawing_layers.mjs";

export const zoom_order = {
    0: [
        {
            drawing_layers: [water_areas_fill],
            filter: ["!=", ["get", "is_small_lake"], true],
            drawing_importance: 5
        },
        {
            drawing_layers: [railway_line],
            // exclude many secondary lines near the station
            filter: ['==', ['get', 'name:en'], 'North–South railway']
        },
        {
            drawing_layers: [city_walls_fill, city_walls_thickening_outline],
            drawing_importance: 2
        },
        {
            drawing_layers: [city_bulk_border],
            drawing_importance: 1
        },

        {
            drawing_layers: [city_title],
            drawing_importance: 1,
            maxzoom: 11.4
        },
    ],
    11.7: [
        {
            drawing_layers: [river_lines],
            drawing_importance: 7
        },
    ],
    13: [
        {
            drawing_layers: [water_areas_fill],
            filter: ["==", ["get", "is_small_lake"], true],
            drawing_importance: 5
        },
    ],
    16: [
        {
            drawing_layers: [railway_line],
            filter: ['!=', ['get', 'name:en'], 'North–South railway'],
            drawing_importance: 6
        },
    ]
}