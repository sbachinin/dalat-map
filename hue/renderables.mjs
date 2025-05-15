import { city_bulk_border, city_bulk_fill, city_bulk_title } from "../js/common_drawing_layers/city_bulk.mjs";
import { get_polygon_as_linestring } from "../scripts/get_polygon_as_linestring.mjs";
import city_bulk_geometry from "./static_data/city_bulk_geometry.mjs";

export const renderables = [

    {
        id: 'City_bulk',
        get_features: () => ([
            city_bulk_geometry,
            get_polygon_as_linestring(city_bulk_geometry)
        ]),
        style_layers: [city_bulk_fill, city_bulk_border, city_bulk_title]
    },
]