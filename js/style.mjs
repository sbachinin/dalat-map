import { get_main_sources } from './sources.mjs'
import { build_layers } from './build_layers.mjs'

export const get_style = () => {
    return {
        name: "Dalat map",

        layers: build_layers(),

        sources: get_main_sources(),

        version: 8,

        "glyphs": `${window.location.origin}/dalat-map-fonts/{fontstack}/{range}.pbf`
    }
}
