import turfCentroid from 'https://cdn.jsdelivr.net/npm/turf-centroid@3.0.12/+esm'

let french_bldgs_geojson = null

const get_f_b_geojson = () => {
    if (french_bldgs_geojson === null) {
        return fetch('../data/french_building.geojson')
            .then(response => response.json())
            .then(geojson => {
                french_bldgs_geojson = geojson
                return geojson
            })
    } else {
        return Promise.resolve(french_bldgs_geojson)
    }
}

get_f_b_geojson()


// Returns [lng, lat]
export const get_feature_center = async (id) => {
    const geojson = await get_f_b_geojson()
    return turfCentroid(geojson.find(f => String(f.id) === String(id)))
        .geometry.coordinates
}