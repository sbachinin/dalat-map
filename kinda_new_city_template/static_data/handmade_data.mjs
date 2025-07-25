import { bldgs_handmade_data } from "./bldgs_handmade_data.mjs"

export const land_areas_handmade_data = {
    // !!! empty items are needed here in order to generate land_areas tile layer
    
}

export const lakes_handmade_data = {
    
}

export const all_handmade_data = {
    ...bldgs_handmade_data,
    ...land_areas_handmade_data,
    ...lakes_handmade_data
}

Object.keys(all_handmade_data).forEach((feat_id) => {
    all_handmade_data[feat_id].id = feat_id
})