import dalatBulkJSON from '../data/static/dalat-bulk-geometry.mjs'
import { centroids_etc } from '../data/centroids_etc.mjs'
import { buildings_handmade_data } from '../data/static/buildings_handmade_data.mjs'


const buildings_titles = {
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
                    title: buildings_handmade_data[fid].title,
                    priority: buildings_handmade_data[fid]?.priority
                }
            }))
    }
}

export const main_sources = {
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
    buildings_titles
}

export const buildings_centroids_with_titles_source = {
    type: 'geojson',
    data: {
        "type": "FeatureCollection",
        "features": Object.entries(centroids_etc)
            .filter(([fid]) => Boolean(buildings_handmade_data[fid]?.title))
            .map(([fid, { centroid }]) => ({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: centroid
                },
                properties: {
                    title: buildings_handmade_data[fid]?.title,
                    priority: buildings_handmade_data[fid]?.priority
                }
            }))
    }
}