import { french_ids } from "../../data/for_runtime/bldgs_ids.mjs"
import { all_handmade_data } from "../../data/static/handmade_data.mjs"

export const is_french_building = fid => french_ids.includes(fid)

export const get_title_side = (fid) => {
    const f_hmdata = all_handmade_data[fid]

    let title_side = 'center'

    if (f_hmdata?.title_side) {
        if (
            !['south', 'north', 'center'].includes(f_hmdata.title_side)) {
            console.warn('This title side is not supported: ', f_hmdata.title_side) // left and right not supported yet
            return null
        }
        title_side = f_hmdata.title_side

    } else if (is_french_building(fid)) {
        title_side = 'south' // default for french bldgs without explici title_side
    }

    return title_side
}
