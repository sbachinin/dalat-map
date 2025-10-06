import {
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
    island_fill,
    bridge_areas_fill
} from "../js/common_drawing_layers/drawing_layers.mjs";
import { city_title, river_lines } from "../js/common_drawing_layers/drawing_layers.mjs";
import { AREA_TYPES, MAJOR_BUILDINGS_POLYGONS_MINZOOM } from "../js/common_drawing_layers/constants.mjs";
import { constants as c } from './constants.mjs'
import { SOURCES_NAMES } from "../js/constants.mjs";
import { historic_polygons } from "../js/common_drawing_layers/historic_polygons.mjs";

export const zoom_order = {


    0: [
        {
            drawing_layers: [land_areas_fill],
            filter: [
                'any',
                ['==', '$id', 610242612],
                ['==', '$id', 1422407517],
                ['==', 'area_type', AREA_TYPES.AIRPORT]
            ],
        },
        {
            drawing_layers: [{
                name: 'unesco_core_zone',
                source: SOURCES_NAMES.CITY_TILES,
                'source-layer': 'unesco_core_zone',
                type: 'fill',
                paint: {
                    'fill-color': `hsl(20, 100%, 80%)`,
                    'fill-opacity': [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        13.5, 1,
                        14, 0
                    ]
                },
            }]
        },

        {
            drawing_layers: [sea_fill]
        },
        {
            drawing_layers: [island_fill]
        },

        {
            drawing_layers: [{ ...water_areas_fill, 'source-layer': 'river_areas' }],
        },

        {
            drawing_layers: [city_title],
            maxzoom: 12
        },
    ],

    11: [
        {
            drawing_layers: [peaks_triangles_with_titles],
            filter: [
                "all",
                ["!=", '$id', 8808910111],
                ["!=", '$id', 8807317455]
            ]
        },
    ],


    11.5: [
        {
            drawing_layers: [french_bldg_circle],
            filter: ["==", ["get", "has_title"], true],
            maxzoom: MAJOR_BUILDINGS_POLYGONS_MINZOOM,
        }
    ],

    12: [
        {
            drawing_layers: [non_french_titles],
        },
        {
            drawing_layers: [land_areas_fill],
            filter: ['==', 'area_type', AREA_TYPES.CEMETERY],
        }
    ],

    12.2: [
        {
            drawing_layers: [french_bldg_circle],
            filter: ["==", ["get", "is_selectable"], true],
            maxzoom: MAJOR_BUILDINGS_POLYGONS_MINZOOM,
        }
    ],

    [c.CITY_BULK_DISAPPEARANCE_ZOOM]: [
        {
            drawing_layers: [land_areas_fill],
            filter: ['!=', 'is_small_area', true],
        },
        {
            drawing_layers: [french_bldg_circle],
            maxzoom: MAJOR_BUILDINGS_POLYGONS_MINZOOM,
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
            drawing_layers: [important_boring_building_fill],
        }
    ],
    14: [
        {
            drawing_layers: [river_lines],
        },

        {
            drawing_layers: historic_polygons.map(l => ({ ...l, 'source-layer': 'historic_building' }))
        }
    ],

    14.5: [
        {
            drawing_layers: [bridge_areas_fill]
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