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
const get_title_side = (f_geojson, f_props) => {
    const hm_side = f_props.title_side

    if (hm_side !== undefined) {
        if (
            !['south', 'north', 'center'].includes(hm_side)) {
            console.warn('This title side is not supported: ', hm_side)
            return null
        }
        return hm_side
    }

    if (is_feature_selectable(f_geojson.id)) {
        return 'south'
    }

    // probably it's a land area
    return 'center'
}



const get_title_lat = (
    f_geojson, // geojson feature
    f_props,
    centroid
) => {
    const title_side = get_title_side(f_geojson, f_props)
    if (title_side === null) {
        console.warn('Invalid title_side for feature', f_geojson.id)
        process.exit(1)
    }

    if (title_side === 'south') {
        return Math.min(...get_all_lats(f_geojson))
    } else if (title_side === 'north') {
        return Math.max(...get_all_lats(f_geojson))
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


export const make_title_point_feature = base_feat => {
    const hmdata = globalThis.current_city.all_handmade_data
    const f_props = {
        ...base_feat.properties,
        ...(hmdata[base_feat.id] || {}),
    }
    if (!f_props.title) {
        throw new Error(`Feature ${base_feat.id} has no title`)
    }

    const coordinates = f_props.title_coords
        || [
            get_centroid(base_feat)[0],
            get_title_lat(base_feat, f_props, get_centroid(base_feat))
        ]

    const title_props = {
        title: f_props.title,
        title_side: get_title_side(base_feat, f_props),
        "symbol-sort-key": f_props["symbol-sort-key"]
    }

    if (is_water_feature(base_feat)) {
        title_props.feature_type = "water"
    }

    return {
        type: "Feature",
        id: base_feat.id,
        geometry: { type: "Point", coordinates },
        properties: { ...base_feat.properties, ...title_props }
    }
}
