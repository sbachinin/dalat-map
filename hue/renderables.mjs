import city_bulk_geometry from "./static_data/city_bulk_geometry.mjs"
import imperial_city_border from "./static_data/imperial_city_border.mjs"

import { get_polygon_as_linestring } from '../js/utils/frontend_utils.mjs'

import { city_bulk_border, city_bulk_fill, city_bulk_title } from "../js/common_drawing_layers/city_bulk.mjs"
import { PALE_TITLES_COLOR, WATER_TITLE_COLOR } from "../js/common_drawing_layers/constants.mjs"
import { get_title_renderable } from "../js/utils/get_title_renderable.mjs"
import { CITY_WALL_COLOR } from "./drawing_layers.mjs"
import { interpolate } from "../js/utils/isomorphic_utils.mjs"
import { constants as c } from "./constants.mjs"
import { markets_titles } from "./static_data/handmade_data.mjs"

export const renderables = [
    {
        id: 'City_bulk',
        get_features: () => ([
            city_bulk_geometry,
            get_polygon_as_linestring(city_bulk_geometry)
        ]),
        style_layers: [city_bulk_fill, city_bulk_border, city_bulk_title]
    },

    get_title_renderable(
        'Citadel',
        [107.57323734, 16.47511394],
        [11.5, 14.5],
        'Noto Sans Regular',
        PALE_TITLES_COLOR,
        interpolate(10, 14, 16, 24)
    ),

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

    get_title_renderable(
        'Imperial\nCity',
        [107.5776242, 16.46931831],
        [12.5, 14],
        'Noto Sans Regular',
        PALE_TITLES_COLOR,
        interpolate(12.5, 12, 14, 16)
    ),

    get_title_renderable(
        'Purple\n(Forbidden)\nCity',
        [107.5772269, 16.47014294],
        [14, 15],
        'Noto Sans Regular',
        c.PURPLE_CITY_COLOR,
        interpolate(14, 12, 15, 16)
    ),


    get_title_renderable(
        "Thanh Lam\nLagoon",
        [107.65837967, 16.5306874],
        [null, 14],
        'Merriweather Italic',
        WATER_TITLE_COLOR,
        interpolate(10, 11, 14, 16)
    ),

    get_title_renderable(
        'South China Sea',
        [107.6846827, 16.5785561],
        [null, 14],
        'Merriweather Italic',
        WATER_TITLE_COLOR,
        interpolate(10, 14, 14, 22)
    ),

    get_title_renderable(
        'Tam Giang\nLagoon',
        [107.56044901, 16.58645882],
        [null, 14],
        'Merriweather Italic',
        WATER_TITLE_COLOR,
        interpolate(10, 11, 14, 16)
    ),

    get_title_renderable(
        'Perfume River',
        [
            [
                107.54521734741724,
                16.432900119720784
            ],
            [
                107.5553730971231,
                16.429910646715683
            ]
        ],
        [12.5, 14.5],
        'Merriweather Italic',
        WATER_TITLE_COLOR,
        interpolate(12.5, 14, 14.5, 24),
    ),

    get_title_renderable(
        'Perfume River',
        [
            [
                107.5770416027525,
                16.461016065145458
            ],
            [
                107.58288908810675,
                16.463671073732726
            ]
        ],
        [13.3, 15],
        'Merriweather Italic',
        WATER_TITLE_COLOR,
        interpolate(13.3, 14, 15, 24),
    ),

    get_title_renderable(
        'National Route 1',
        [
            [
                107.61354782800203,
                16.38494438712938
            ],
            [
                107.6355722997892,
                16.37537349744889
            ]
        ],
        [11, 15],
        'Noto Sans Regular',
        WATER_TITLE_COLOR,
        interpolate(11, 11, 15, 24),
        'bottom'
    ),

    get_title_renderable(
        'National Route 1',
        [
            [
                107.49568433463094,
                16.465863271273292
            ],
            [
                107.51121018347351,
                16.453803863303833
            ]
        ],
        [11, 15],
        'Noto Sans Regular',
        WATER_TITLE_COLOR,
        interpolate(11, 11, 15, 24),
        'bottom'
    ),

    {
        id: 'purple_city',
        get_features: () => [{
            "type": "Feature",
            "properties": {},
            "geometry": {
                "coordinates": [[
                    [107.57504239789421, 16.47042702475305],
                    [107.5767931338072, 16.468086359200527],
                    [107.57944479586598, 16.469998109097304],
                    [107.57768766591613, 16.472277475806536],
                    [107.57504239789421, 16.47042702475305]
                ]],
                "type": "Polygon"
            }
        }],
        style_layers: [
            {
                type: 'line',
                paint: {
                    'line-color': c.PURPLE_CITY_COLOR,
                    'line-opacity': 0.5,
                    'line-width': 2
                },
                drawing_importance: 8
            }
        ]
    },

    {
        id: 'Markets_Titles',
        get_features: () => {
            return Object.entries(markets_titles).map(([fid, { title, title_coords }]) => {
                return {
                    type: 'Feature',
                    id: fid,
                    properties: { title },
                    geometry: {
                        type: 'Point',
                        coordinates: title_coords
                    }
                }
            })
        },
        style_layers: [{
            type: 'symbol',
            layout: {
                "text-field": ['get', 'title'],
                'text-size': 12,
                'text-font': ['Noto Sans Regular'],
            },
            paint: {
                "text-color": PALE_TITLES_COLOR,
            },
            minzoom: 14.3
        }]
    }
]
