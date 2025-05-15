import {
    all_handmade_data,
    lakes_handmade_data
} from '../dalat/static_data/handmade_data.mjs'
import { is_french_building } from './utils/isomorphic_utils.mjs'
import { get_title_side } from './utils/isomorphic_utils.mjs'
import { get_geojson_source } from './utils/utils.mjs'
import { current_city } from './load_city.mjs'
import { SOURCES_NAMES } from './constants.mjs'

const get_titles_props = fid => {
    const fdata = all_handmade_data[fid]
    if (!fdata) return {}

    return {
        title: fdata.title,
        is_french: is_french_building(fid),
        title_side: get_title_side(fid, all_handmade_data),
        is_water: !!lakes_handmade_data[fid],
        "symbol-sort-key": fdata["symbol-sort-key"]
    }
}

const get_title_final_coords = fid => {
    // either hardcoded coords
    // or coords just below the feature's polygon.
    // It's for plain high-zoom titles, not for tiny_squares
    const hardcoded_coords = all_handmade_data[fid]?.title_coords
    const generated_coords = current_city.centroids_etc[fid]
    if (!hardcoded_coords && !generated_coords) {
        console.warn(`title coords cannot be found; maybe something is going wrong.
Could be that some handmade title was added but tiles weren't generated after that.`)
        return
    }
    return hardcoded_coords
        || [generated_coords.centroid[0], generated_coords.title_lat]
}


const get_titles_points = () => ({
    type: 'geojson',
    data: {
        "type": "FeatureCollection",
        "features": Object.keys(all_handmade_data)
            .filter(id => Boolean(all_handmade_data[id].title))
            .map(Number)
            .map(fid => {
                return {
                    type: "Feature",
                    id: fid,
                    geometry: {
                        type: "Point",
                        coordinates: get_title_final_coords(fid)
                    },
                    properties: get_titles_props(fid)
                }
            })
            .filter(f => f.geometry.coordinates)
    }
})

const get_centroids_as_features = () => Object.entries(current_city.centroids_etc).map(([feat_id, data]) => {
    return {
        "type": "Feature",
        id: feat_id,
        "geometry": {
            "type": "Point",
            "coordinates": data.centroid
        }
    }
})

export const get_main_sources = () => {
    if (!current_city) {
        throw new Error('current_city is undefined in get_main_sources, there is some mistake here')
    }

    const sources = {
        [SOURCES_NAMES.CITY_TILES]: {
            type: 'vector',
            tiles: [`${window.location.origin}/cities_tiles/${current_city.name}/tiles/{z}/{x}/{y}.pbf`],
            minzoom: 10,
        },
        [SOURCES_NAMES.TITLES_POINTS]: get_titles_points(),
        bldgs_centroids_points: get_geojson_source(get_centroids_as_features())
    }

    if (current_city.city_title_coords) {
        sources[SOURCES_NAMES.CITY_TITLE] = get_geojson_source(
            [{
                type: "Feature",
                properties: { title: current_city.name.charAt(0).toUpperCase() + current_city.name.slice(1) },
                geometry: {
                    type: "Point",
                    coordinates: current_city.city_title_coords
                },
            }]
        )
    }

    return sources
}
