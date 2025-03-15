import { all_handmade_data } from "../data/static/handmade_data.mjs"

export const does_building_have_details = id => {
    if (id === undefined) {
        console.warn('Trying to get building details but id is undefined. Hmm')
    }
    const bldg_hm_data = all_handmade_data[id]
    return Boolean(
        bldg_hm_data && (
            bldg_hm_data.images?.length
            || bldg_hm_data.links?.length
            || (typeof bldg_hm_data.wikipedia === 'string' && bldg_hm_data.wikipedia.length > 0)
            || (typeof bldg_hm_data.google === 'string' && bldg_hm_data.google.length > 0)
        )
    )
}

export const does_building_have_title = id => Boolean(
    typeof all_handmade_data[id]?.title === 'string' && all_handmade_data[id]?.title.length > 0
)


