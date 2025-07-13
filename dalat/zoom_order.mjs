import { get_filter_by_fids } from "../js/common_zoom_order.mjs";

import {
    boring_bldg_with_details_border,
    boring_building_fill,
    boring_building_square,
    cable_car_endpoints,
    cable_car_line,
    french_bldg_circle,
    french_buildings_titles,
    land_areas_fill,
    non_french_titles,
    peaks_triangles_with_titles,
    railway_line,
    railway_station_titles_with_squares,
    towns_fill,
    water_areas_fill
} from "../js/common_drawing_layers/drawing_layers.mjs";
import { city_title, river_lines } from "../js/common_drawing_layers/drawing_layers.mjs";
import { AREA_TYPES, FRENCH_GEOMETRIES_MINZOOM } from "../js/common_drawing_layers/constants.mjs";
import { all_handmade_data as hmd } from "../dalat/static_data/handmade_data.mjs";
import { constants as c } from './constants.mjs'

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
            filter: get_filter_by_fids(
                hmd[125165263], // southern big lake
                hmd[141724809], // smaller lake near ankroet
                hmd[64737684], // bigger lake near ankroet
            ),
            drawing_layers: [non_french_titles]
        },

        {
            drawing_layers: [city_title],
            drawing_importance: 1,
            maxzoom: 12
        },
    ],

    11: [
        {
            drawing_layers: [peaks_triangles_with_titles],
            drawing_importance: 0,
            filter: ['!=', 'ele', '1503']
        },
        { drawing_layers: [cable_car_line, cable_car_endpoints] },
    ],


    11.5: [
        {
            drawing_layers: [french_bldg_circle],
            filter: ["==", ["get", "has_title"], true],
            maxzoom: FRENCH_GEOMETRIES_MINZOOM,
            drawing_importance: 2
        }
    ],

    12: [
        {
            drawing_layers: [non_french_titles],
            filter: get_filter_by_fids(
                hmd[99661171], // golf course
                hmd[463866449], // bus station
                hmd[1232634198], // stadium
            ),
        },
    ],

    12.2: [
        {
            drawing_layers: [french_bldg_circle],
            filter: ["==", ["get", "is_selectable"], true],
            maxzoom: FRENCH_GEOMETRIES_MINZOOM,
            drawing_importance: 2
        }
    ],

    [c.CITY_BULK_DISAPPEARANCE_ZOOM]: [
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
        {
            drawing_layers: [french_bldg_circle],
            maxzoom: FRENCH_GEOMETRIES_MINZOOM,
            drawing_importance: 2
        }
    ],
    13: [
        {
            drawing_layers: [land_areas_fill],
            filter: ['==', 'is_small_area', true],
            drawing_importance: 6
        },

        { drawing_layers: [railway_line] },
        { drawing_layers: [railway_station_titles_with_squares] },

        {
            drawing_layers: [peaks_triangles_with_titles],
            drawing_importance: 0,
            filter: ['==', 'ele', '1503']
        },
        {
            drawing_layers: [boring_building_square],
            filter: get_filter_by_fids(
                hmd[1244767000],
                hmd[1305230699],
                hmd[361851927],
                hmd[4119185],
                hmd[308446691]
            ),
            maxzoom: 14,
            drawing_importance: 3
        },
        {
            drawing_layers: [non_french_titles],
            filter: get_filter_by_fids(
                hmd[969458761], // university
            ),
        },
        { drawing_layers: [french_buildings_titles] },
    ],
    13.5: [
        {
            drawing_layers: [non_french_titles],
            filter: get_filter_by_fids(
                hmd[1244767000], // nguyen tomb
                hmd[473547288], // nuclear research
                hmd[1355564844], // military academy
            )
        },
    ],
    14: [
        {
            drawing_layers: [river_lines],
            "filter": ['!=', 'name', 'Suối Cam Ly'],
            drawing_importance: 7
        },
        {
            drawing_layers: [boring_building_fill],
            filter: ["==", ['get', 'is_selectable'], true],
            drawing_importance: 5
        },
        {
            drawing_layers: [boring_bldg_with_details_border],
            drawing_importance: 3
        },
        {
            filter: [
                "any",
                ["==", ["get", "feature_type"], 'water'],
                get_filter_by_fids(
                    hmd[473556887], // hospital
                    hmd[473755163], // du sinh cemetery
                    hmd[4119185], // market
                    hmd[521598340], // yersin univer
                    hmd[1307493492], // ana mandara 
                    hmd[18645373], // co sat pagoda
                    hmd[361851927], // linh son pagoda
                    hmd[1356287796], // truc lam monastery
                    hmd[1305230699], // Madame
                    hmd[7758125], // youth prison
                    hmd[1303837487], // lam vien square
                    hmd[99660916], // yersin park
                )
            ],
            drawing_layers: [non_french_titles]
        },
    ],

    15: [
        { drawing_layers: [non_french_titles] },
    ]
}