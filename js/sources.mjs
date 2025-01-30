import dalatBulkJSON from '../data/static/dalat-bulk-geometry.mjs'
import { centroids_etc } from '../data/for_runtime/centroids_etc.mjs'
import {
    all_handmade_data,
    french_bldgs_handmade_data,
    land_areas_handmade_data,
    non_french_bldgs_handmade_data
} from '../data/static/handmade_data.mjs'
import { TITLES_PRIORITY } from './layers/constants.mjs'


const get_titles_props = fid => {
    const fdata = all_handmade_data[fid]
    if (!fdata) return {}

    let priority = null
    if (typeof fdata.priority === 'number') {
        priority = fdata.priority
    } else if (fdata.second_rate) {
        priority = TITLES_PRIORITY.VERY_LOW
    }

    return {
        title: fdata.title,
        priority,
        second_rate: fdata.second_rate,
        is_french: !!french_bldgs_handmade_data[fid]
    }
}

const get_title_final_coords = fid => {
    // either hardcoded coords
    // or coords just below the feature's polygon.
    // It's for plain high-zoom titles, not for tiny_squares
    const hardcoded_coords = all_handmade_data[fid]?.title_coords
    const generated_coords = centroids_etc[fid]
    if (!hardcoded_coords && !generated_coords) {
        throw new Error('title coords cannot be found; maybe something is going wrong')
    }
    return hardcoded_coords
        || [generated_coords.centroid[0], generated_coords.title_lat]
}

const land_areas_titles = {
    type: 'geojson',
    data: {
        "type": "FeatureCollection",
        "features":
            Object.keys(land_areas_handmade_data)
                .filter(fid => !!land_areas_handmade_data[fid].title)
                .map(fid => {
                    return {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: get_title_final_coords(fid)
                        },
                        properties: {
                            ...get_titles_props(fid)
                        }
                    }
                })
    }
}

const buildings_titles = {
    type: 'geojson',
    data: {
        "type": "FeatureCollection",
        "features": Object.keys(centroids_etc)
            .filter(fid => french_bldgs_handmade_data[fid]?.title
                || non_french_bldgs_handmade_data[fid]?.title
            )
            .map(fid => {
                return {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: get_title_final_coords(fid)
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
    land_areas_titles,
    buildings_titles
}

export const buildings_centroids_with_titles_source = {
    type: 'geojson',
    data: {
        "type": "FeatureCollection",
        "features": Object.entries(centroids_etc)
            .filter(([fid]) => Boolean(all_handmade_data[fid]?.title))
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