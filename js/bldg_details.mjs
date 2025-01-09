import { panel } from './panel/panel.mjs'
import meta from './french_buildings_meta.mjs'
import { select_bldg } from './select_building.mjs'
import { create_panel_thumbs_list } from './panel/panel_thumbs_list.mjs'
import { update_panel_thumbs_list_size_variables } from './panel/panel_thumbs_list_size_manager.mjs'
import { push_to_history } from './utils.mjs'

export const building_has_details = featureMeta => {
    return featureMeta && (featureMeta.images/*  || featureMeta.descr */)
}

const update_size_variables = () => {
    update_panel_thumbs_list_size_variables({
        max_width_ratio: 40 // TODO just copied from highlights but need to think
    })
}

export const show_bldg_details = (details) => {
    if (!details.images?.length) return

    const details_el = create_panel_thumbs_list({
        content_type: 'bldg_details',
        images_names: details.images
    })

    panel.set_content({
        update: update_size_variables,
        element: details_el
    })

    update_size_variables()

    panel.expand()
}


export const try_open_building = (
    id,
    should_push_history = false,
    force_fly_to = false
) => {
    if (force_fly_to) {
        window.dalatmap.easeTo()
    }
    const featureMeta = meta[id]
    if (building_has_details(featureMeta)) {
        show_bldg_details(featureMeta)
        select_bldg(id)
        should_push_history && push_to_history(
            { id },
            `?id=${id}${window.location.hash}`
        )
    }
}