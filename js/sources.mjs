import { centroids_etc } from '../data/for_runtime/centroids_etc.mjs'
import { bldgs_handmade_data } from '../data/static/bldgs_handmade_data.mjs'

import {
    all_handmade_data,
    lakes_handmade_data,
    land_areas_handmade_data,
} from '../data/static/handmade_data.mjs'
import { is_french_building } from './utils/isomorphic_utils.mjs'
import { get_title_side } from './utils/isomorphic_utils.mjs'
import { get_geojson_source } from './utils/utils.mjs'

export const SOURCES_NAMES = {
    DALAT_TILES: 'dalat_tiles',
    BUILDING_TITLES_POINTS: 'building_title',
}

const get_titles_props = fid => {
    const fdata = all_handmade_data[fid]
    if (!fdata) return {}

    return {
        title: fdata.title,
        second_rate: !!fdata.second_rate,
        is_french: is_french_building(fid),
        title_side: get_title_side(fid),
        min_zoom: fdata.min_zoom,
        "symbol-sort-key": fdata["symbol-sort-key"]
    }
}

const get_title_final_coords = fid => {
    // either hardcoded coords
    // or coords just below the feature's polygon.
    // It's for plain high-zoom titles, not for tiny_squares
    const hardcoded_coords = all_handmade_data[fid]?.title_coords
    const generated_coords = centroids_etc[fid]
    if (!hardcoded_coords && !generated_coords) {
        console.warn(`title coords cannot be found; maybe something is going wrong.
Could be that some handmade title was added but tiles weren't generated after that.`)
        return
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

const lakes_titles = {
    type: 'geojson',
    data: {
        "type": "FeatureCollection",
        "features": Object.keys(lakes_handmade_data).map(fid => {
            return {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: lakes_handmade_data[fid].title_coords
                },
                properties: {
                    ...get_titles_props(fid)
                }
            }
        })
    }
}

const building_titles_points = {
    type: 'geojson',
    data: {
        "type": "FeatureCollection",
        "features": Object.keys(bldgs_handmade_data)
            .filter(id => Boolean(bldgs_handmade_data[id].title))
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
    }
}

const datanla_waterfall = get_geojson_source(
    [{
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: [108.4488444, 11.9011774]
        }
    }]
)


export const main_sources = {
    [SOURCES_NAMES.DALAT_TILES]: {
        type: 'vector',
        tiles: [`${window.location.origin}/dalat-map-tiles/tiles/{z}/{x}/{y}.pbf`],
        minzoom: 10,
    },
    land_areas_titles,
    [SOURCES_NAMES.BUILDING_TITLES_POINTS]: building_titles_points,
    lakes_titles,
    datanla_waterfall
}
