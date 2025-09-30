import city_bulk_geometry from "./static_data/city_bulk_geometry.mjs"
import { get_polygon_as_linestring } from '../js/utils/frontend_utils.mjs'
import { get_midPoint_feature_with_text_rotate } from "../js/utils/get_midPoint_feature_with_text_rotate.mjs"

import {
    PALE_TITLES_COLOR,
    PALE_TITLES_SIZE,
    WATER_TITLE_COLOR
} from "../js/common_drawing_layers/constants.mjs";
import { city_bulk_border, city_bulk_fill, city_bulk_title } from "../js/common_drawing_layers/city_bulk.mjs";

import { get_point_feature } from "../js/utils/isomorphic_utils.mjs";


export const renderables = [
    {
        id: 'Cable_car_label',
        get_features: () => {
            const cable_car_stations_coords = [[108.4434298, 11.9230389], [108.4369496, 11.9041084]]
            return [get_midPoint_feature_with_text_rotate(cable_car_stations_coords[0], cable_car_stations_coords[1])]
        },
        style_layers: [
            {
                minzoom: 12,
                type: 'symbol',
                "layout": {
                    "text-field": "Cable car",
                    "text-font": ["Noto Sans Regular"],
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
                    'text-font': ['Noto Sans Regular'],
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
                    "text-field": "Lac\nDuong",
                    'text-size': [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        10, 12,
                        16, 18],
                    'text-font': ['Noto Sans Regular']
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
                    'text-font': ['Noto Sans Regular']
                },
                paint: {
                    'text-color': WATER_TITLE_COLOR
                },
            }
        ]
    },





    {
        id: 'City_bulk',
        get_features: () => ([
            city_bulk_geometry,
            get_polygon_as_linestring(city_bulk_geometry)
        ]),
        style_layers: [city_bulk_fill, city_bulk_border, city_bulk_title]
    },

]