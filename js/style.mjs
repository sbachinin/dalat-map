import { get_main_sources } from './sources.mjs'
import {
    city_bulk_border,
    city_bulk_fill,
} from './layers/other_layers.mjs'
import { build_layers } from './build_layers.mjs'
import { river_lines } from './layers/rivers.mjs'
import { land_areas_fill } from './drawing_layers.mjs'

export const get_style = () => {
    return {
        name: "Dalat map",

        layers: [

            // so here some layers are "hardcoded", not built
            // Basically they are "basic" layers that show up early and have low drawing priority
            // For consistency i could add them to the build
            // But for now it doesn't look like a problem, apart from this minor code dirt
            city_bulk_fill,
            land_areas_fill,
            city_bulk_border,
            river_lines,

            ...build_layers(),
        ],

        sources: get_main_sources(),

        version: 8,

        "glyphs": `${window.location.origin}/dalat-map-fonts/{fontstack}/{range}.pbf`
    }
}
