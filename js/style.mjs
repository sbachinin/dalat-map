import { main_sources } from './sources.mjs'
import roads from './layers/roads.mjs'
import rivers from './layers/rivers.mjs'
import lakes from './layers/lakes.mjs'
import {
    french_buildings_titles,
    shit_buildings_titles
} from './layers/titles.mjs'
import {
    boring_building_fill,
    city_bulk_border,
    city_bulk_fill,
    city_bulk_title,
    land_areas_fill,
    land_areas_titles,
    peaks_triangles_with_titles
} from './layers/other_layers.mjs'
import { transportation_other } from './layers/transportation_other.mjs'
import { french_polygons_layers } from './layers/french_polygons.mjs'

export const style = {
    name: "Dalat map",

    layers: [
        city_bulk_fill,
        city_bulk_border,
        land_areas_fill,
        ...rivers,
        boring_building_fill,
        ...french_polygons_layers,
        ...lakes,
        ...roads,
        ...transportation_other,
        city_bulk_title,
        peaks_triangles_with_titles,
        shit_buildings_titles,
        land_areas_titles,
        french_buildings_titles,
    ],
    sources: main_sources,

    version: 8,

    "glyphs": `${window.location.origin}/dalat-map-fonts/{fontstack}/{range}.pbf`
}