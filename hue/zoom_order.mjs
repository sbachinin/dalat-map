import {
    selectable_boring_bldg_border,
    boring_building_fill,
    french_bldg_circle,
    french_buildings_titles,
    land_areas_fill,
    non_french_titles,
    railway_line,
    water_areas_fill,
    important_boring_building_fill
} from "../js/common_drawing_layers/drawing_layers.mjs";
import { city_title, river_lines } from "../js/common_drawing_layers/drawing_layers.mjs";
import { FRENCH_GEOMETRIES_MINZOOM } from "../js/common_drawing_layers/constants.mjs";
import { city_walls_fill, city_walls_thickening_outline, non_french_bldgs_within_imperial_city_fill, unesco_areas_border, unesco_areas_fill, unesco_areas_titles } from "./drawing_layers.mjs";
import { constants as c } from "./constants.mjs";

export const zoom_order = {
    0: [
        {
            drawing_layers: [water_areas_fill],
            filter: ["!=", ["get", "is_small_lake"], true],
            drawing_importance: 5
        },
        {
            drawing_layers: [land_areas_fill],
            drawing_importance: 6
        },
        {
            drawing_layers: [railway_line],
            // exclude many secondary lines near the station
            filter: ['==', ['get', 'name:en'], 'North–South railway'],
            drawing_importance: 5
        },
        {
            drawing_layers: [city_walls_fill, city_walls_thickening_outline],
            drawing_importance: 2
        },

        {
            drawing_layers: [city_title],
            drawing_importance: 1,
            maxzoom: 11.4
        },
    ],
    10.5: [
        {
            drawing_layers: [french_bldg_circle],
            filter: ["==", ["get", "has_title"], true],
            maxzoom: FRENCH_GEOMETRIES_MINZOOM,
            drawing_importance: 2
        }
    ],
    11.7: [
        {
            drawing_layers: [river_lines],
            drawing_importance: 7
        },
        {
            drawing_layers: [french_bldg_circle],
            filter: ["==", ["get", "is_selectable"], true],
            maxzoom: FRENCH_GEOMETRIES_MINZOOM,
            drawing_importance: 2
        }
    ],

    [c.CITY_BULK_DISAPPEARANCE_ZOOM]: [
        {
            drawing_layers: [unesco_areas_fill, unesco_areas_border],
            drawing_importance: 6
        },
        { drawing_layers: [unesco_areas_titles], drawing_importance: 0 }
    ],

    12.5: [
        {
            drawing_layers: [french_bldg_circle],
            maxzoom: FRENCH_GEOMETRIES_MINZOOM,
            drawing_importance: 2
        }
    ],
    13: [
        {
            drawing_layers: [water_areas_fill],
            filter: ["==", ["get", "is_small_lake"], true],
            drawing_importance: 6
        },
    ],

    14: [
        {
            drawing_layers: [non_french_bldgs_within_imperial_city_fill],
            drawing_importance: 5
        },
        { drawing_layers: [french_buildings_titles] },
        {
            drawing_layers: [important_boring_building_fill, selectable_boring_bldg_border]
        }
    ],
    15: [
        { drawing_layers: [non_french_titles] },
        {
            drawing_layers: [boring_building_fill],
            drawing_importance: 5
        },
        {
            drawing_layers: [selectable_boring_bldg_border],
            drawing_importance: 3
        }
    ],
    16: [
        {
            drawing_layers: [railway_line],
            filter: ['!=', ['get', 'name:en'], 'North–South railway'],
            drawing_importance: 6
        },
    ]
}