import { panel } from './panel/panel.mjs'
import { all_handmade_data } from '../data/static/handmade_data.mjs'
import { select_bldg, selected_building_id } from './select_building.mjs'
import { create_panel_thumbs_list } from './panel/panel_thumbs_list.mjs'
import { update_panel_thumbs_list_size_variables } from './panel/panel_thumbs_list_size_manager.mjs'
import { coords_are_in_view, get_map_center_shift, push_to_history } from './utils.mjs'
import { centroids_etc } from '../data/for_runtime/centroids_etc.mjs'

export const building_has_details = featureMeta => {
    return featureMeta && (featureMeta.images/*  || featureMeta.descr */)
}

const update_size_variables = () => {
    update_panel_thumbs_list_size_variables({
        max_width_ratio: 40 // TODO just copied from highlights but need to think
    })
}

const show_bldg_details = (details, id) => {
    if (!details.images?.length) return

    const details_el = create_panel_thumbs_list({
        content_description: 'building_' + id,
        images_names: details.images
    })

    panel.set_content({
        update: update_size_variables,
        element: details_el
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

    const featureMeta = all_handmade_data[id]
    if (building_has_details(featureMeta)) {
        show_bldg_details(featureMeta, id)
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
    if (coords_are_in_view(feature_screen_xy)) return
    window.dalatmap.easeTo({
        center: feature_center_arr,
        zoom: Math.max(window.dalatmap.getZoom(), 15),
        offset: get_map_center_shift()
    })
}