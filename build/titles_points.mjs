import { get_centroid } from "../js/utils/isomorphic_utils.mjs"

const get_all_lats = feature => {
    if (!feature?.geometry?.coordinates) {
        throw new Error("Invalid GeoJSON feature")
    }

    const { type, coordinates } = feature.geometry

    let all_lats = []

    if (type === "Polygon") {
        all_lats = coordinates[0].map(coord => coord[1])
    } else if (type === "MultiPolygon") {
        all_lats = coordinates.flat(2).map(coord => coord[1])
    } else {
        throw new Error("Geometry type must be Polygon or MultiPolygon")
    }

    return all_lats
}

// All titles are positioned at the center of the building,
// except those with "title_side" handmade prop
// and french (positioned at south if title_side not specified).
// Returns 'south', 'north' or 'center'
// 'Left' and 'right' could also make sense but there was no need so far
const get_title_side = (f, hmdata) => {
    const f_hmdata = hmdata[f.id]

    let title_side = 'center'

    if (f_hmdata?.title_side) {
        if (
            !['south', 'north', 'center'].includes(f_hmdata.title_side)) {
            console.warn('This title side is not supported: ', f_hmdata.title_side)
            return null
        }
        title_side = f_hmdata.title_side

    } else if (f.properties['building:architecture'] === 'french_colonial') {
        title_side = 'south'
    }

    return title_side
}



const get_title_lat = (
    f, // geojson feature
    hmd,
    centroid
) => {
    const title_side = get_title_side(f, hmd)
    if (title_side === null) {
        console.warn('Invalid title_side for feature', f.id)
        process.exit(1)
    }

    if (title_side === 'south') {
        return Math.min(...get_all_lats(f))
    } else if (title_side === 'north') {
        return Math.max(...get_all_lats(f))
    } else if (title_side === 'center') {
        return centroid[1]
    }
}





export const make_title_point_feature = (f, all_handmade_data, feature_type) => {
    let coordinates = all_handmade_data[f.id].title_coords
    if (!coordinates) {
        const centroid = get_centroid(f)
        coordinates = [
            centroid[0],
            get_title_lat(f, all_handmade_data, centroid)
        ]
    }

    const title_props = {
        title: all_handmade_data[f.id].title,
        title_side: get_title_side(f, all_handmade_data),
        feature_type,
        "symbol-sort-key": all_handmade_data[f.id]["symbol-sort-key"]
    }
    return {
        type: "Feature",
        id: f.id,
        geometry: { type: "Point", coordinates },
        properties: { ...f.properties, ...title_props }
    }
}

export const get_titles_points_tiling_settings = (all_handmade_data, lakes_handmade_data) => {
    return {
        name: 'titles_points',
        feature_filter: f => Boolean(all_handmade_data[f.id]?.title),
        feature_transform: f => make_title_point_feature(
            f,
            all_handmade_data,
            lakes_handmade_data[f.id] && 'water'
        ),
        feature_props_to_preserve: ['building:architecture']
    }
}