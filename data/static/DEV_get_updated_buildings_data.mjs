/* 
    GOAL
    Run this code from browser console
    to get updated french handmade data with added or updated entries from localstorage
        (where i keep ids to images dictionary)
    Returned handmade data object is to be copypasted to handmade_data.mjs
*/

/*
    This has a smell.
    All the new ids will be (blindly) added to french handmade data
        but there's no guarantee that they are actually french.
        Therefore some non-french building might get rendered as french
        To avoid this, i have a chore find_french_impostors;
            if they are found, I can manually move them to non-french handmade data.
            It's not serious but not yet big enough to bother.
            But basically it's a hint that db might be necessary soon
*/

import { french_bldgs_handmade_data as meta } from "./handmade_data.mjs"

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