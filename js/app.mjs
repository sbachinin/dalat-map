import { sources } from './sources.mjs'
import { manage_scale } from './manage_scale.mjs'
import roads from './layers/roads.mjs'
import rivers from './layers/rivers.mjs'
import lakes from './layers/lakes.mjs'
import buildings from './layers/buildings.mjs'
import { addMouseStuff } from './mouse_stuff.mjs'
import meta from './french_buildings_meta.mjs'

const style = {
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
        ...buildings,
        ...roads
    ],
    sources,

    version: 8,
}

const map = new maplibregl.Map({
    container: 'map',
    style,
    hash: true,
    center: [108.44409, 11.945],
    zoom: 0,
    maxBounds: [
        [108.37416, 11.88], // SW
        [108.52, 12.01]  // NE
    ],
    antialias: true,
    maxZoom: 17.99
});

addMouseStuff(map)

map.addControl(new maplibregl.ScaleControl());
map.addControl(new maplibregl.NavigationControl(), 'top-right');

map.once('idle', () => {
    for (let frenchBuildingId of Object.keys(meta)) {
        map.setFeatureState(
            { source: 'dalat-tiles', sourceLayer: 'french_building', id: frenchBuildingId },
            { hasDetails: true }
        );
    }
})

manage_scale()