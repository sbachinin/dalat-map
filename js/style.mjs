import { main_sources } from './sources.mjs'
import roads from './layers/roads.mjs'
import rivers from './layers/rivers.mjs'
import lakes from './layers/lakes.mjs'
import { buildings_layers, boring_building_layers, french_buildings_titles, shit_buildings_titles } from './layers/buildings.mjs'
import { city_bulk, land_areas_fill, land_areas_titles } from './layers/other_layers.mjs'

export const style = {
    name: "Dalat map",

    layers: [
        city_bulk,
        land_areas_fill,
        ...rivers,
        ...boring_building_layers,
        ...buildings_layers,
        ...roads,
        ...lakes,
        shit_buildings_titles,
        land_areas_titles,
        french_buildings_titles,
    ],
    sources: main_sources,

    version: 8,

    "glyphs": `${window.location.origin}/dalat-map-fonts/{fontstack}/{range}.pbf`
}