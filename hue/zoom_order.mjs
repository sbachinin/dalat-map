import {
    boring_building_fill,
    french_bldg_circle,
    french_buildings_titles,
    land_areas_fill,
    non_french_titles,
    railway_line,
    water_areas_fill,
    important_boring_building_fill,
    stadium_fill,
    peaks_triangles_with_titles,
    bridge_areas_fill
} from "../js/common_drawing_layers/drawing_layers.mjs";
import { city_title, river_lines } from "../js/common_drawing_layers/drawing_layers.mjs";
import { MAJOR_BUILDINGS_POLYGONS_MINZOOM } from "../js/common_drawing_layers/constants.mjs";
import { city_walls_fill, city_walls_thickening_outline, non_french_bldgs_within_imperial_city_fill, unesco_areas_border, unesco_areas_fill, unesco_areas_titles } from "./drawing_layers.mjs";
import { constants as c } from "./constants.mjs";
import { historic_polygons } from "../js/common_drawing_layers/historic_polygons.mjs";
import { SOURCES_NAMES } from "../js/constants.mjs";

export const zoom_order = {
    0: [
        {
            drawing_layers: [water_areas_fill],
            filter: ["!=", ["get", "is_small_lake"], true],
        },
        {
            drawing_layers: [land_areas_fill],
        },
        {
            drawing_layers: [railway_line],
            // exclude many secondary lines near the station
            filter: ['==', ['get', 'is_main_railway_line'], true],
        },
        {
            drawing_layers: [city_walls_fill, city_walls_thickening_outline],
        },

        {
            drawing_layers: [city_title],
            maxzoom: 11.4
        },
    ],
    10.5: [
        {
            drawing_layers: [french_bldg_circle],
            filter: ["==", ["get", "has_title"], true],
            maxzoom: MAJOR_BUILDINGS_POLYGONS_MINZOOM,
        },
    ],

    11.7: [
        {
            drawing_layers: [river_lines],
        },
        {
            drawing_layers: [french_bldg_circle],
            filter: ["==", ["get", "is_selectable"], true],
            maxzoom: MAJOR_BUILDINGS_POLYGONS_MINZOOM,
        }
    ],

    [c.CITY_BULK_DISAPPEARANCE_ZOOM]: [
        {
            drawing_layers: [unesco_areas_fill, unesco_areas_border],
        },
        {
            drawing_layers: [unesco_areas_titles]
        }
    ],

    12.5: [
        {
            drawing_layers: [french_bldg_circle],
            maxzoom: MAJOR_BUILDINGS_POLYGONS_MINZOOM,
        },

        {
            drawing_layers: [peaks_triangles_with_titles],
        }
    ],
    13: [
        {
            drawing_layers: [water_areas_fill],
            filter: ["==", ["get", "is_small_lake"], true],
        },
    ],

    [MAJOR_BUILDINGS_POLYGONS_MINZOOM]: [
        {
            drawing_layers: historic_polygons.map(l => ({ ...l, 'source-layer': 'french_building' })),
        },
        {
            drawing_layers: [bridge_areas_fill]
        }
    ],

    14: [
        {
            drawing_layers: [non_french_bldgs_within_imperial_city_fill],
        },
        {
            drawing_layers: [french_buildings_titles]
        },
        {
            drawing_layers: [important_boring_building_fill]
        },
        {
            // needs a higher importance to appear on top of city wall, plus a distinct color 
            filter: ['==', ['get', 'historic'], 'city_gate'],
            drawing_layers: [
                {
                    "name": "City gate fill",
                    "type": "fill",
                    "source": SOURCES_NAMES.CITY_TILES,
                    "source-layer": "important_boring_building",
                    drawing_importance: 1.5,
                    "paint": {
                        "fill-color": 'hsl(273, 100%, 90%)',
                        "fill-antialias": true,
                    }
                }
                
            ],
        },
    ],

    14.5: [
        {
            drawing_layers: [stadium_fill]
        }
    ],
    15: [
        {
            drawing_layers: [non_french_titles]
        },
        {
            drawing_layers: [boring_building_fill],
        }
    ],
    16: [
        {
            drawing_layers: [railway_line],
            filter: ['!=', ['get', 'is_main_railway_line'], true],
        },
    ]
}