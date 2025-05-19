import { city_bulk_border, city_bulk_fill, city_bulk_title } from "../js/common_drawing_layers/city_bulk.mjs";
import { get_polygon_as_linestring } from "../build/get_polygon_as_linestring.mjs";
import city_bulk_geometry from "./static_data/city_bulk_geometry.mjs";
import dead_buildings from "./static_data/dead_buildings.mjs";
import { get_dead_buildings_renderable } from "../js/common_renderables.mjs";
import { PALE_TITLES_COLOR, WATER_TITLE_COLOR } from "../js/common_drawing_layers/constants.mjs";
import { get_title_renderable } from "../js/utils/get_title_renderable.mjs";
import imperial_city_border from "./static_data/imperial_city_border.mjs";
import { CITY_WALL_COLOR } from "./drawing_layers.mjs";

const interpolate = (z1, v1, z2, v2) => {
    return [
        "interpolate",
        ["linear"],
        ["zoom"],
        z1, v1,
        z2, v2
    ]
}

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
        'Lato Regular',
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
        [107.577519678, 16.4694936767],
        [12.5, 14],
        'Lato Regular',
        PALE_TITLES_COLOR,
        interpolate(12.5, 12, 14, 16)
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
        [107.5455278, 16.4327962],
        [12.5, 14.5],
        'Merriweather Italic',
        WATER_TITLE_COLOR,
        interpolate(12.5, 14, 14.5, 24),
        15
    ),

    get_title_renderable(
        'Perfume River',
        [107.58025697480184, 16.462485581481218],
        [13.3, 15],
        'Merriweather Italic',
        WATER_TITLE_COLOR,
        interpolate(13.3, 14, 15, 24),
        -24
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
                type: 'fill',
                paint: {
                    'fill-color': 'purple',
                    'fill-opacity': [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        12.5,
                        0.1,
                        15,
                        0.02
                    ]
                },
                drawing_importance: 8
            }
        ]
    },

    get_dead_buildings_renderable(dead_buildings),
]
