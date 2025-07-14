import { load_build_only_modules } from "../build/load_build_only_modules.mjs"
const bom = await load_build_only_modules([
    ['city_bulk_geometry', './dalat/static_data/city_bulk_geometry.mjs'],
    ['dead_buildings_geojson', './dalat/static_data/dead_buildings_geojson.mjs'],
    ['get_midPoint_feature_with_text_rotate', './build/get_midPoint_feature_with_text_rotate.mjs', 'get_midPoint_feature_with_text_rotate'],
    ['get_polygon_as_linestring', './build/get_polygon_as_linestring.mjs', 'get_polygon_as_linestring'],
])

import {
    PALE_TITLES_COLOR,
    PALE_TITLES_SIZE,
    WATER_TITLE_COLOR
} from "../js/common_drawing_layers/constants.mjs";
import { city_bulk_border, city_bulk_fill, city_bulk_title } from "../js/common_drawing_layers/city_bulk.mjs";

// TODO: importing like this from build/ is a smell
// It means that frontend imports something that it doesn't need
// In this case, this import is too small to bother.
// But in principle, it's a bad design and needs to be improved
import { get_dead_buildings_renderable } from "../js/common_renderables.mjs";
import { get_point_feature } from "../js/utils/isomorphic_utils.mjs";
import { all_handmade_data } from "./static_data/handmade_data.mjs"


export const renderables = [
    {
        id: 'Cable_car_label',
        get_features: (all_features) => {

            const cable_car_stations = all_features.filter(f => f.properties.aerialway === 'station')
            const coords1 = cable_car_stations[0].geometry.coordinates
            const coords2 = cable_car_stations[1].geometry.coordinates
            return [bom.get_midPoint_feature_with_text_rotate(coords1, coords2)]
        },
        style_layers: [
            {
                minzoom: 12,
                type: 'symbol',
                "layout": {
                    "text-field": "Cable car",
                    "text-font": ["Lato Regular"],
                    "text-size": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        12, 10,
                        16, 14
                    ],
                    'text-rotate': ["get", "text_rotate"],
                    "text-letter-spacing": 0.1,
                    "text-anchor": "bottom",
                    "text-offset": [0, -0.1],
                    "text-allow-overlap": true
                },
                "paint": {
                    "text-color": PALE_TITLES_COLOR,
                },
            }
        ]
    },





    {
        id: 'Datanla_waterfall',
        get_features: () => [get_point_feature([108.4488444, 11.9011774])],
        style_layers: [
            {
                type: 'symbol',
                minzoom: 12,
                layout: {
                    "icon-image": "water_square",
                    "icon-size": 0.12,
                    "text-field": "Datanla\nwaterfall",
                    "text-anchor": "top",
                    "text-offset": [0, 0.2],
                    'text-size': PALE_TITLES_SIZE,
                    'text-font': ['Lato Regular'],
                    "symbol-sort-key": 1,
                },
                paint: {
                    'text-color': WATER_TITLE_COLOR
                },
            }
        ]
    },


    {
        id: 'Lac_Duong_title',
        get_features: () => [get_point_feature([108.42049039331886, 12.00963086343829])],
        style_layers: [
            {
                type: 'symbol',
                minzoom: 10,
                maxzoom: 15,
                layout: {
                    "text-field": "Lac Duong",
                    'text-size': [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        10, 14,
                        16, 24],
                    'text-font': ['Lato Regular']
                },
                paint: {
                    'text-color': PALE_TITLES_COLOR
                },
            }
        ]
    },


    {
        id: 'Cam_Ly_titles',
        get_features: () => [
            {
                ...get_point_feature([108.40540965179486, 11.966917979701066]),
                properties: {
                    rotate: 10,
                    text_anchor: 'bottom',
                    text_offset: [0, -0.3],
                }
            },
            {
                ...get_point_feature([108.34981570114951, 11.935637726367332]),
                properties: {
                    rotate: -23,
                    text_anchor: 'top',
                    text_offset: [0, 0.2],
                }
            }
        ],
        style_layers: [
            {
                type: 'symbol',
                minzoom: 10,
                maxzoom: 14,
                layout: {
                    "text-field": "Cam  Ly",
                    'text-anchor': ['get', 'text_anchor'],
                    'text-offset': ['get', 'text_offset'],
                    'text-rotate': ["get", "rotate"],
                    'text-size': [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        10, 8,
                        14, 16],
                    'text-font': ['Lato Regular']
                },
                paint: {
                    'text-color': WATER_TITLE_COLOR
                },
            }
        ]
    },





    get_dead_buildings_renderable(bom.dead_buildings_geojson, all_handmade_data),


    {
        id: 'City_bulk',
        get_features: () => ([
            bom.city_bulk_geometry,
            bom.get_polygon_as_linestring(bom.city_bulk_geometry)
        ]),
        style_layers: [city_bulk_fill, city_bulk_border, city_bulk_title]
    },

]