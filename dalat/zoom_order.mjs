import { land_areas_fill, towns_fill, water_areas_fill } from "../js/drawing_layers.mjs";
import { city_bulk_border, river_lines } from "../js/layers/common_drawing_layers.mjs";
import { AREA_TYPES, CITY_BULK_DISAPPEARANCE_ZOOM } from "../js/layers/constants.mjs";

export const zoom_order = {
    0: [
        {
            drawing_layers: [land_areas_fill],
            filter: [
                "any",
                ['==', '$id', 99661171]
            ],
            drawing_importance: 6
        },

        {
            drawing_layers: [towns_fill],
            filter: [
                "any",
                ['==', 'area_type', AREA_TYPES.TOWN],
            ],
            drawing_importance: 7
        },

        {
            drawing_layers: [water_areas_fill],
            drawing_importance: 5
        },

        {
            drawing_layers: [river_lines],
            "filter": ['==', 'name', 'Suối Cam Ly'],
            drawing_importance: 7
        },

        {
            drawing_layers: [city_bulk_border],
            drawing_importance: 1
        },

        {
            drawing_layers: [city_title],
            drawing_importance: 1,
            maxzoom: 12
        },
    ],

    ],
    [CITY_BULK_DISAPPEARANCE_ZOOM]: [
        {
            drawing_layers: [land_areas_fill],
            filter: [
                "any",
                ['==', '$id', 473556887], // take hospital
                [
                    'all',
                    ['!=', '$id', 99661171], // exclude golf
                    ['!=', 'is_small_area', true]
                ]

            ],
            drawing_importance: 6
        },
    ],
    13: [
        {
            drawing_layers: [land_areas_fill],
            filter: ['==', 'is_small_area', true],
            drawing_importance: 6
        },
    ],
    14: [
        {
            drawing_layers: [river_lines],
            "filter": ['!=', 'name', 'Suối Cam Ly'],
            drawing_importance: 7
        }
    ]
}