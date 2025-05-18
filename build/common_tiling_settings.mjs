import { get_title_lat, get_title_side } from "./utils.mjs"

export const get_titles_points_tiling_settings = (all_handmade_data, lakes_handmade_data) => {
    return {
        name: 'titles_points',
        feature_filter: f => Boolean(all_handmade_data[f.id]?.title),
        feature_transform: f => {

            let coordinates = all_handmade_data[f.id].title_coords
                || [
                    turf.centerOfMass(f).geometry.coordinates[0],
                    get_title_lat(f, all_handmade_data)
                ]

            const title_props = {
                title: all_handmade_data[f.id].title,
                is_french: f.properties['building:architecture'] === 'french_colonial',
                title_side: get_title_side(f, all_handmade_data),
                is_water: !!lakes_handmade_data[f.id],
                "symbol-sort-key": all_handmade_data[f.id]["symbol-sort-key"]
            }
            return {
                type: "Feature",
                id: f.id,
                geometry: { type: "Point", coordinates },
                properties: { ...f.properties, ...title_props }
            }
        },
        feature_props_to_preserve: ['building:architecture']
    }
}