import dalatBulkJSON from './data/dalat-bulk-geometry.mjs'

export const sources = {
    "contours": {
        "url": "https://api.maptiler.com/tiles/contours/tiles.json?key=9C8cs9qKiCW3wSWdeUrN",
        "type": "vector"
    },
    "maptiler_planet": {
        "url": "https://api.maptiler.com/tiles/v3/tiles.json?key=9C8cs9qKiCW3wSWdeUrN",
        "type": "vector"
    },
    
    'dalat-tiles': {
        type: 'vector',
        tiles: ["http://localhost:8080/tiles/{z}/{x}/{y}.pbf"],
        minzoom: 10,
        maxzoom: 24
    },

    "maptiler_attribution": {
        "attribution": "<a href=\"https://www.maptiler.com/copyright/\" target=\"_blank\">&copy; MapTiler</a> <a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\">&copy; OpenStreetMap contributors</a>",
        "type": "vector"
    },
    "cityBulk": {
        "type": "geojson",
        "data": dalatBulkJSON,
        maxzoom: 14.3
    }
}