import { panel, PANEL_CONTENT_TYPES } from './panel/panel.mjs'
import { all_handmade_data } from '../data/static/handmade_data.mjs'
import { select_bldg, selected_building_id } from './select_building.mjs'
import { create_panel_thumbs_list } from './panel/panel_thumbs_list.mjs'
import { update_panel_thumbs_list_size_variables } from './panel/panel_thumbs_list_size_manager.mjs'
import { coords_are_in_view, get_map_center_shift, push_to_history } from './utils.mjs'
import { centroids_etc } from '../data/for_runtime/centroids_etc.mjs'

export const building_has_details = id => {
    if (id === undefined) {
        console.warn('Trying to get building details but id is undefined. Hmm')
    }
    return all_handmade_data[id]?.images?.length
}


const update_size_variables = () => {
    update_panel_thumbs_list_size_variables({
        max_width_ratio: 40 // TODO just copied from highlights but need to think
    })
}


const show_bldg_details = async (id) => {
    const details_el = create_panel_thumbs_list({
        images_names: all_handmade_data[id].images
    })

    await panel.set_content({
        update: update_size_variables,
        element: details_el,
        type: PANEL_CONTENT_TYPES.BUILDING
    })

    update_size_variables()

    panel.expand()
}

export const try_open_building = async (
    id,
    should_push_history = false,
    should_try_to_fly = false
) => {
    if (id === selected_building_id) {
        panel.expand()
        return
    }

    if (building_has_details(id)) {
        show_bldg_details(id)
        select_bldg(id)
        should_push_history && push_to_history(
            { id },
            `?id=${id}${window.location.hash}`
        )
    }

    if (!should_try_to_fly) return
    await panel.full_size_promise // because panel setsize is async
    const feature_center_arr = centroids_etc[id].centroid
    const feature_screen_xy = window.dalatmap.project(feature_center_arr)
    const map_zoom = window.dalatmap.getZoom()
    if (!coords_are_in_view(feature_screen_xy)
        || map_zoom < 15.5
    ) {
        window.dalatmap.easeTo({
            /* I used to get center from get_center_for_bldg_with_offset(id)
             and avoid passing offset
             but in case of changing zooming this smart offset value was wrong
             for it was calculated for initial zoom level
            */
            center: centroids_etc[id]?.centroid,
            offset: get_map_center_shift(),
            zoom: Math.max(15.5, map_zoom),
            duration: 1600
        })
    }
}