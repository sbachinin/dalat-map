import { main_sources } from './sources.mjs'
import { lakes_fill } from './layers/lakes.mjs'
import {
    city_bulk_border,
    city_bulk_fill,
} from './layers/other_layers.mjs'
import { build_layers } from './build_layers.mjs'
import { cam_ly_line, other_rivers_lines } from './layers/rivers.mjs'
console.log(build_layers().map(l => l.id).join('\n'))
export const style = {
    name: "Dalat map",

    layers: [
        city_bulk_fill,
        city_bulk_border,
        other_rivers_lines,
        cam_ly_line,
        lakes_fill, // TODO: need a way to draw it on top of rivers, otherwise grand lac has a river drawn on top of it

        ...build_layers(),

        // land_areas_fill,
        // ...rivers,
        // boring_building_fill,
        // ...french_polygons_layers,
        // ...roads,
        // ...transportation_other,
        // lakes_titles,
        // city_bulk_title,
        // peaks_triangles_with_titles,
        // shit_buildings_titles,
        // land_areas_titles,
        // french_buildings_titles,
    ],
    sources: main_sources,

    version: 8,

    "glyphs": `${window.location.origin}/dalat-map-fonts/{fontstack}/{range}.pbf`
}