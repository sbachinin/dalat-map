import { current_city } from "../load_city.mjs"

export const is_feature_selectable = (
    id,
    hmdata = current_city?.all_handmade_data,
    fids_to_img_names = current_city?.fids_to_img_names
) => {
    if (!hmdata) {
        throw new Error('hmdata is undefined')
    }
    if (id === undefined) {
        console.warn('Trying to get building details but id is undefined. Hmm')
    }
    const feat_hm_data = hmdata[id]

    if (fids_to_img_names[id]?.length) {
        return true
    }

    if (!feat_hm_data) {
        return false
    }
    return Boolean(
        feat_hm_data.subtitle
        || feat_hm_data.links?.length
        || (typeof feat_hm_data.wikipedia === 'string' && feat_hm_data.wikipedia.length > 0)
        || (typeof feat_hm_data.google === 'string' && feat_hm_data.google.length > 0)
    )
}

export const does_feature_have_title = (id, hmdata = current_city?.all_handmade_data) => {
    if (!hmdata) {
        throw new Error('hmdata is undefined')
    }
    return Boolean(
        typeof hmdata[id]?.title === 'string'
        && hmdata[id]?.title.length > 0
    )
}

