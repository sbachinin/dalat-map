import dalatBulkJSON from '../data/static/dalat-bulk-geometry.mjs'

export const sources = {
    // "contours": {
    //     "url": "https://api.maptiler.com/tiles/contours/tiles.json?key=9C8cs9qKiCW3wSWdeUrN",
    //     "type": "vector"
    // },
    'dalat-tiles': {
        type: 'vector',
        tiles: [`${window.location.origin}/dalat-map-tiles/tiles/{z}/{x}/{y}.pbf`],
        minzoom: 10,
    },
    "cityBulk": {
        "type": "geojson",
        "data": dalatBulkJSON,
        maxzoom: 14.3
    }
}