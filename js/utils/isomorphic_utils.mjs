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