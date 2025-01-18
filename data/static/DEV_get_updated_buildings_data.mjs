import { buildings_handmade_data as meta } from "./buildings_handmade_data.mjs"

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