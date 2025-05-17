import { city_bulk_border, city_bulk_fill, city_bulk_title } from "../js/common_drawing_layers/city_bulk.mjs";
import { get_polygon_as_linestring } from "../build/get_polygon_as_linestring.mjs";
import city_bulk_geometry from "./static_data/city_bulk_geometry.mjs";
import { dead_buildings_drawing_layers } from "../js/common_drawing_layers/dead_buildings_drawing_layers.mjs";

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
        id: 'Dead_buildings',
        get_features: () => dead_buildings,
        style_layers: dead_buildings_drawing_layers
    },
]