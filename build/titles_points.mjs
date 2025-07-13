import { get_title_lat, get_title_side } from "./build_utils.mjs"

export const make_title_point_feature = (f, all_handmade_data, feature_type) => {
    let coordinates = all_handmade_data[f.id].title_coords
        || [
            turf.centerOfMass(f).geometry.coordinates[0],
            get_title_lat(f, all_handmade_data)
        ]

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