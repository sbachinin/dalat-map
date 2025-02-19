/* 
    GOAL
    Run this code from browser console
    to get updated bldgs handmade data with added or updated entries from localstorage
        (where i keep ids to images dictionary)
    Returned object is to be copypasted to bldgs_handmade_data.mjs
*/

import { bldgs_handmade_data as meta } from "./bldgs_handmade_data.mjs"

window.get_updated_buildings_data = () => {
    const ids_to_imgs = JSON.parse(localStorage.getItem('ids_to_imgs'))
    Object.entries(ids_to_imgs).forEach(([feat_id, imgs]) => {
        meta[feat_id] = meta[feat_id] || {}
        meta[feat_id].images = meta[feat_id].images || []
        const new_imgs = imgs.filter(im => !meta[feat_id].images.includes(im))
        meta[feat_id].images.push(...new_imgs)
    })
    return meta
}