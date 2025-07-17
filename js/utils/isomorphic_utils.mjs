export const is_one_of = (val, arr) => arr.some(v => v === val)

export const get_point_feature = (coords) => {
    return {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: coords
        },
        properties: {}
    }
}


export const interpolate = (z1, v1, z2, v2) => {
    return [
        "interpolate",
        ["linear"],
        ["zoom"],
        z1, v1,
        z2, v2
    ]
}


export const deep_merge_objects = (target, source) => {
    const result = { ...target }

    for (const key in source) {
        if (source.hasOwnProperty(key) &&
            typeof source[key] === 'object' &&
            source[key] !== null &&
            !Array.isArray(source[key])) {
            result[key] = deep_merge_objects(result[key] || {}, source[key])
        } else {
            result[key] = source[key]
        }
    }

    return result
}


export const pick = (obj, props) => {
    return props.reduce((result, prop) => {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            result[prop] = obj[prop]
        }
        return result
    }, {})
}



export const get_map_bounds_center = (map_bounds) => {
    return [
        map_bounds[0] + (map_bounds[2] - map_bounds[0]) / 2,
        map_bounds[1] + (map_bounds[3] - map_bounds[1]) / 2
    ]
}


export const lnglat_is_within_bounds = (lnglat, bounds) => { // lnglat: [lng, lat], bounds: [w, s, e, n]
    return (
        lnglat[0] >= bounds[0]
        && lnglat[0] <= bounds[2]
        && lnglat[1] >= bounds[1]
        && lnglat[1] <= bounds[3]
    )
}



export const find_bldg_id_by_image_filename = (filename) => {
    const [bldg_id] = Object.entries(current_city.fids_to_img_names)
        .find(([_, feat_img_names]) => {
            return feat_img_names.includes(filename)
        }) || [null]
    return Number(bldg_id)
}


export const get_geojson_source = (features) => {
    return {
        type: "geojson",
        data: {
            "type": "FeatureCollection",
            features
        }
    }
}

export const within = (number, min, max) => Math.max(min, Math.min(number, max))

export const get_centroid = f => {
    const raw_centroid = globalThis.turf.centroid(f)
    return [
        Number(raw_centroid.geometry.coordinates[0].toFixed(6)),
        Number(raw_centroid.geometry.coordinates[1].toFixed(6))
    ]
}
