import { all_handmade_data } from "../../data/static/handmade_data.mjs"

export const is_feature_selectable = id => {
    if (id === undefined) {
        console.warn('Trying to get building details but id is undefined. Hmm')
    }
    const feat_hm_data = all_handmade_data[id]
    return Boolean(
        feat_hm_data && (
            feat_hm_data.subtitle
            || feat_hm_data.images?.length
            || feat_hm_data.links?.length
            || (typeof feat_hm_data.wikipedia === 'string' && feat_hm_data.wikipedia.length > 0)
            || (typeof feat_hm_data.google === 'string' && feat_hm_data.google.length > 0)
        )
    )
}

export const does_feature_have_title = id => Boolean(
    typeof all_handmade_data[id]?.title === 'string' && all_handmade_data[id]?.title.length > 0
)


