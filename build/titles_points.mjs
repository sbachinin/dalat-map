import { is_feature_selectable } from "../js/utils/does_feature_have_details.mjs"
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
    const hm_side = hmdata[f.id]?.title_side

    if (hm_side !== undefined) {
        if (
            !['south', 'north', 'center'].includes(hm_side)) {
            console.warn('This title side is not supported: ', hm_side)
            return null
        }
        return hm_side
    }

    if (is_feature_selectable(f.id)) {
        return 'south'
    }

    // probably it's a land area
    return 'center'
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

const is_water_feature = f => {
    if (!f.properties) {
        return false
    }
    return f.properties.natural === 'water' ||
        f.properties.natural === 'bay' ||
        f.properties.natural === 'strait' ||
        f.properties.natural === 'wetland' ||
        f.properties.waterway === 'river' ||
        f.properties.waterway === 'stream' ||
        f.properties.waterway === 'canal' ||
        f.properties.waterway === 'drain' ||
        f.properties.waterway === 'ditch' ||
        f.properties.landuse === 'reservoir' ||
        f.properties.landuse === 'basin' ||
        f.properties.place === 'ocean' ||
        f.properties.place === 'sea'
}


export const make_title_point_feature = f => {
    const hmdata = globalThis.current_city.all_handmade_data
    let coordinates = hmdata[f.id].title_coords
    if (!coordinates) {
        const centroid = get_centroid(f)
        coordinates = [
            centroid[0],
            get_title_lat(f, hmdata, centroid)
        ]
    }

    const title_props = {
        title: hmdata[f.id].title,
        title_side: get_title_side(f, hmdata),
        "symbol-sort-key": hmdata[f.id]["symbol-sort-key"]
    }

    if (is_water_feature(f)) {
        title_props.feature_type = "water"
    }

    return {
        type: "Feature",
        id: f.id,
        geometry: { type: "Point", coordinates },
        properties: { ...f.properties, ...title_props }
    }
}
