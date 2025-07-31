import { get_filter_by_fids } from "../js/common_zoom_order.mjs";

import {
    selectable_boring_bldg_border,
    boring_building_fill,
    french_bldg_circle,
    french_buildings_titles,
    land_areas_fill,
    non_french_titles,
    peaks_triangles_with_titles,
    railway_line,
    railway_station_titles_with_squares,
    important_boring_building_fill,
    water_areas_fill,
    sea_fill,
    island_fill
} from "../js/common_drawing_layers/drawing_layers.mjs";
import { city_title, river_lines } from "../js/common_drawing_layers/drawing_layers.mjs";
import { FRENCH_GEOMETRIES_MINZOOM } from "../js/common_drawing_layers/constants.mjs";
import { all_handmade_data as hmd } from "../dalat/static_data/handmade_data.mjs";
import { constants as c } from './constants.mjs'
import { SOURCES_NAMES } from "../js/constants.mjs";

export const zoom_order = {


    0: [
        {
            drawing_layers: [sea_fill]
        },
        {
            drawing_layers: [island_fill]
        },

        {
            drawing_layers: [water_areas_fill],
            filter: ['==', ['get', 'is_river'], true],
        },

        {
            drawing_layers: [city_title],
            maxzoom: 12
        },
    ],

    11: [
        {
            drawing_layers: [peaks_triangles_with_titles],
        },
    ],


    11.5: [
        {
            drawing_layers: [french_bldg_circle],
            filter: ["==", ["get", "has_title"], true],
            maxzoom: FRENCH_GEOMETRIES_MINZOOM,
        }
    ],

    12: [
        {
            drawing_layers: [non_french_titles],
        },
    ],

    12.2: [
        {
            drawing_layers: [french_bldg_circle],
            filter: ["==", ["get", "is_selectable"], true],
            maxzoom: FRENCH_GEOMETRIES_MINZOOM,
        }
    ],

    [c.CITY_BULK_DISAPPEARANCE_ZOOM]: [
        {
            drawing_layers: [land_areas_fill],
            filter: ['!=', 'is_small_area', true],
        },
        {
            drawing_layers: [french_bldg_circle],
            maxzoom: FRENCH_GEOMETRIES_MINZOOM,
        }
    ],
    13: [
        {
            drawing_layers: [land_areas_fill],
            filter: ['==', 'is_small_area', true],
        },

        {
            drawing_layers: [railway_line]
        },
        {
            drawing_layers: [railway_station_titles_with_squares]
        },

        {
            drawing_layers: [french_buildings_titles]
        },
    ],
    13.5: [
        {
            drawing_layers: [water_areas_fill],
            filter: ['!=', ['get', 'is_river'], true],
        },
        {
            drawing_layers: [important_boring_building_fill, selectable_boring_bldg_border],
        }
    ],
    14: [
        {
            drawing_layers: [river_lines],
        },
        {
            drawing_layers: [{
                name: 'Historic building',
                type: 'fill',
                source: SOURCES_NAMES.CITY_TILES,
                'source-layer': 'historic_building',
                paint: {
                    'fill-color': 'hsl(25, 70%, 40%)',
                    'fill-antialias': true,
                    'fill-opacity': 1
                }
            }],
        }
    ],

    15.3: [
        {
            drawing_layers: [non_french_titles]
        },
        {
            drawing_layers: [boring_building_fill],
        },
    ]
}