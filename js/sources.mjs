import dalatBulkJSON from '../data/static/dalat-bulk-geometry.mjs'
import { centroids_etc } from '../data/centroids_etc.mjs'
import { buildings_handmade_data } from '../data/static/buildings_handmade_data.mjs'

export const sources = {
    'dalat-tiles': {
        type: 'vector',
        tiles: [`${window.location.origin}/dalat-map-tiles/tiles/{z}/{x}/{y}.pbf`],
        minzoom: 10,
    },
    "cityBulk": {
        "type": "geojson",
        "data": dalatBulkJSON,
        maxzoom: 14.3
    },
    buildings_titles: {
        type: 'geojson',
        data: {
            "type": "FeatureCollection",
            "features": Object.entries(centroids_etc)
                .filter(([fid]) => Boolean(buildings_handmade_data[fid]?.title))
                .map(([fid, { centroid, title_lat }]) => ({
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [centroid[0], title_lat]
                    },
                    properties: {
                        title: buildings_handmade_data[fid].title
                    }
                }))
        }
    }
}