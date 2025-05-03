import { french_ids } from "../../data/generated_for_runtime/bldgs_ids.mjs"

export const is_french_building = fid => french_ids.includes(Number(fid))


// All titles are positioned at the center of the building,
// except those with "title_side" handmade prop
// and french (positioned at south if title_side not specified).
// Returns 'south', 'north' or 'center'
// 'Left' and 'right' could also make sense but there was no need so far
export const get_title_side = (fid, hmdata) => {
    const f_hmdata = hmdata[fid]

    let title_side = 'center'

    if (f_hmdata?.title_side) {
        if (
            !['south', 'north', 'center'].includes(f_hmdata.title_side)) {
            console.warn('This title side is not supported: ', f_hmdata.title_side)
            return null
        }
        title_side = f_hmdata.title_side

    } else if (is_french_building(fid)) {
        title_side = 'south'
    }

    return title_side
}

export const is_one_of = (val, arr) => arr.some(v => v === val)