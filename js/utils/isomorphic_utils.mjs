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
    if (!source) return target
    if (!target) return source

    const result = { ...target }

    for (const key in source) {
        if (!source.hasOwnProperty(key)) {
            continue
        }
        const target_value = result[key]
        const source_value = source[key]

        if (Array.isArray(target_value) && Array.isArray(source_value)) {
            result[key] = [...new Set([...target_value, ...source_value])]
        } else if (is_object(target_value) && is_object(source_value)) {
            result[key] = deep_merge_objects(target_value, source_value)
        } else {
            result[key] = source_value
        }

    }
    return result
}

function is_object(item) {
    return item && typeof item === 'object' && !Array.isArray(item) && item !== null
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
    if (f.geometry.type === 'Point') {
        throw new Error(`Trying to get centroid of a point, it looks wrong. Feature id: ` + f.id)
    }
    const raw_centroid = globalThis.turf.centerOfMass(f)
    return [
        Number(raw_centroid.geometry.coordinates[0].toFixed(6)),
        Number(raw_centroid.geometry.coordinates[1].toFixed(6))
    ]
}



export const is_building_polygon = f => f.properties?.building && f.geometry.type !== 'Point'

export const make_polygon_feat = (coords, id, props) => {
    return {
        id,
        type: 'Feature',
        properties: props || {},
        geometry: {
            type: 'Polygon',
            coordinates: coords,
        }
    }
}