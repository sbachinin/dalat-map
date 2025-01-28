import { main_sources } from './sources.mjs'
import roads from './layers/roads.mjs'
import rivers from './layers/rivers.mjs'
import lakes from './layers/lakes.mjs'
import { buildings_layers, boring_building_layers, french_buildings_titles, shit_buildings_titles } from './layers/buildings.mjs'

export const style = {
    name: "Dalat map",

    layers: [
        {
            id: 'cityBulk',
            type: 'fill',
            source: 'cityBulk',
            minzoom: 10,
            maxzoom: 14.3,
            paint: {
                'fill-color': 'RGB(237, 195, 180)',
                'fill-antialias': true,
                "fill-opacity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    13.6,  // Zoom level at which opacity should start decreasing
                    1,   // Opacity at zoom level 14
                    14.3,  // Zoom level just above 14
                    0    // Opacity at zoom level 15 and higher
                ]
            }
        },
        {
            id: 'Land areas fill',
            type: 'fill',
            source: 'dalat-tiles',
            'source-layer': 'land_areas',
            paint: {
                'fill-color': [
                    "case",
                    ["==", ["id"], 1307493492], 'hsl(70, 30%, 83%)', // ana mandara
                    'hsl(70, 50%, 70%)',
                ],
                'fill-antialias': true,
            }
        },

        // areas titles layer, in the middle of geometry
        ...rivers,
        ...lakes,
        ...boring_building_layers,
        ...buildings_layers,
        ...roads,
        shit_buildings_titles,
        french_buildings_titles
    ],
    sources: main_sources,

    version: 8,

    "glyphs": `${window.location.origin}/fonts/{fontstack}/{range}.pbf`
}