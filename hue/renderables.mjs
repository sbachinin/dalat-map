import { city_bulk_border, city_bulk_fill, city_bulk_title } from "../js/common_drawing_layers/city_bulk.mjs";
import { get_polygon_as_linestring } from "../build/get_polygon_as_linestring.mjs";
import city_bulk_geometry from "./static_data/city_bulk_geometry.mjs";
import dead_buildings from "./static_data/dead_buildings.mjs";
import { get_dead_buildings_renderable } from "../js/common_renderables.mjs";
import { PALE_TITLES_COLOR } from "../js/common_drawing_layers/constants.mjs";
import { get_point_feature } from "../js/utils/isomorphic_utils.mjs";
import imperial_city_border from "./static_data/imperial_city_border.mjs";
import { CITY_WALL_COLOR } from "./drawing_layers.mjs";

export const renderables = [

    {
        id: 'City_bulk',
        get_features: () => ([
            city_bulk_geometry,
            get_polygon_as_linestring(city_bulk_geometry)
        ]),
        style_layers: [city_bulk_fill, city_bulk_border, city_bulk_title]
    },

    {
        id: 'Citadel_title',
        get_features: () => ([
            get_point_feature([107.57323734, 16.47511394])
        ]),
        style_layers: [
            {
                type: 'symbol',
                minzoom: 11.5,
                maxzoom: 14.5,
                layout: {
                    "text-field": "Citadel",
                    'text-size': [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        10, 14,
                        16, 24],
                    'text-font': ['Lato Regular'],
                },
                paint: {
                    'text-color': PALE_TITLES_COLOR
                },
            }
        ]
    },

    {
        id: 'imperial_city_border',
        get_features: () => [imperial_city_border],
        style_layers: [{
            type: 'line',
            'paint': {
                'line-color': CITY_WALL_COLOR,
                'line-width': [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    11.5,
                    1,
                    13,
                    2
                ],
                'line-opacity': 0.65
            }
        }]
    },

    {
        id: 'imperial_city_title',
        get_features: () => [get_point_feature([107.577519678, 16.4694936767])],
        style_layers: [{
            type: 'symbol',
            minzoom: 12.5,
            maxzoom: 14,
            layout: {
                "text-field": "Imperial\nCity",
                'text-size': [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    12.5, 12,
                    14, 16],
                'text-font': ['Lato Regular'],
            },
            paint: {
                'text-color': PALE_TITLES_COLOR
            },
        }]
    },

    {
        id: 'thanh_lam_lagoon_title',
        get_features: () => [get_point_feature([107.65837967, 16.5306874])],
        style_layers: [{
            type: 'symbol',
            maxzoom: 14,
            layout: {
                "text-field": "Thanh Lam\nLagoon",
                'text-size': [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    10, 11,
                    14, 16],
                'text-font': ['Merriweather Italic']
            },
            paint: {
                'text-color': PALE_TITLES_COLOR
            },
        }]
    },

    {
        id: 'south_china_sea_title',
        get_features: () => [get_point_feature([107.6846827, 16.5785561])],
        style_layers: [{
            type: 'symbol',
            maxzoom: 14,
            layout: {
                "text-field": "South China Sea",
                'text-size': [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    10, 14,
                    14, 22],
                'text-font': ['Merriweather Italic']
            },
            paint: {
                'text-color': PALE_TITLES_COLOR
            },
        }]
    },

    {
        id: 'tam_giang_lagoon_title',
        get_features: () => [get_point_feature([107.56044901, 16.58645882])],
        style_layers: [{
            type: 'symbol',
            maxzoom: 14,
            layout: {
                "text-field": "Tam Giang\nLagoon",
                'text-size': [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    10, 11,
                    14, 16],
                'text-font': ['Merriweather Italic']
            },
            paint: {
                'text-color': PALE_TITLES_COLOR
            },
        }]
    },

    get_dead_buildings_renderable(dead_buildings),
]