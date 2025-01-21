import { main_sources } from './sources.mjs'
import roads from './layers/roads.mjs'
import rivers from './layers/rivers.mjs'
import lakes from './layers/lakes.mjs'
import { french_building_layers, boring_building_layers } from './layers/buildings.mjs'

export const style = {
    name: "Purely topographic map",

    // glyphs: "https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=9C8cs9qKiCW3wSWdeUrN",
    // sprite: "https://api.maptiler.com/maps/topo-v2/sprite",

    layers: [
        // {
        //     id: 'Bg',
        //     type: 'background',
        //     "layout": { "visibility": "none" },
        //     "paint": { "background-color": "HSL(121.6, 11%, 73%)" }
        // },
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
            id: 'Grass',
            type: 'fill',
            source: 'dalat-tiles',
            'source-layer': 'grass',
            paint: {
                'fill-color': [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    13.6,  // Zoom level at which opacity should start decreasing
                    'hsl(70, 70%, 50%)',   // Opacity at zoom level 14
                    14.3,  // Zoom level just above 14
                    'hsl(70, 50%, 70%)'    // Opacity at zoom level 15 and higher
                ],
                'fill-antialias': true,
            },
            "filter": [
                "any",
                [
                    "all",
                    ["!=", "name", "Sacom Golf Club"],
                    ["==", "leisure", "golf_course"]
                ],
                ["==", "name:en", "Anh Sang"],
                ["==", "name", "Công viên Yersin"]

            ],
        },
        ...rivers,
        ...lakes,
        ...boring_building_layers,
        ...roads,
        ...french_building_layers
    ],
    sources: main_sources,

    version: 8,
    "glyphs": "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf"
}