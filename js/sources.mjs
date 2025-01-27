import dalatBulkJSON from '../data/static/dalat-bulk-geometry.mjs'
import { centroids_etc } from '../data/for_runtime/centroids_etc.mjs'
import { all_buildings_handmade_data, french_bldgs_handmade_data } from '../data/static/buildings_handmade_data.mjs'


const get_titles_props = fid => ({
    title: all_buildings_handmade_data[fid].title,
    priority: all_buildings_handmade_data[fid]?.priority,
    is_french: !!french_bldgs_handmade_data[fid]
})

const buildings_titles = {
    type: 'geojson',
    data: {
        "type": "FeatureCollection",
        "features": Object.entries(centroids_etc)
            .filter(([fid]) => Boolean(all_buildings_handmade_data[fid]?.title))
            .map(([fid, { centroid, title_lat }]) => {
                const lat = all_buildings_handmade_data[fid]?.use_middle_lat
                    ? centroid[1]
                    : title_lat
                // TODO use_middle_lat is actually underimplemented;
                // Feature only gets a middle coord
                // but text-anchor is "top" and therefore title will be slightly below the middle
                return {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [centroid[0], lat]
                    },
                    properties: get_titles_props(fid)
                }
            })
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
            .filter(([fid]) => Boolean(all_buildings_handmade_data[fid]?.title))
            .map(([fid, { centroid }]) => ({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: centroid
                },
                properties: get_titles_props(fid)
            }))
    }
}