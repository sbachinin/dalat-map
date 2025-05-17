import { get_centroid } from "./get_centroid.mjs"

export const get_Point_at_center = (f) => {
    return {
        type: 'Feature',
        properties: f.properties,
        geometry: {
            type: 'Point',
            coordinates: get_centroid(f)
        }
    }
}