import city_bulk_geometry from "./static_data/city_bulk_geometry.mjs"
import dead_buildings_geojson from "./static_data/dead_buildings_geojson.mjs"
import { get_polygon_as_linestring } from '../js/utils/frontend_utils.mjs'
import { city_bulk_border, city_bulk_fill, city_bulk_title } from "../js/common_drawing_layers/city_bulk.mjs";
import { get_dead_buildings_renderable } from "../js/common_renderables.mjs";
import { all_handmade_data } from "./static_data/handmade_data.mjs"


export const renderables = [

    get_dead_buildings_renderable(dead_buildings_geojson, all_handmade_data),


    {
        id: 'City_bulk',
        get_features: () => ([
            city_bulk_geometry,
            get_polygon_as_linestring(city_bulk_geometry)
        ]),
        style_layers: [city_bulk_fill, city_bulk_border, city_bulk_title]
    },

]