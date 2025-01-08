import { create_lazy_image } from './lazy-image.mjs'
import { get_image_url } from './utils.mjs'
import { panel } from './panel/panel.mjs'
import meta from './french_buildings_meta.mjs'
import { select_bldg } from './select_building.mjs'
import { create_panel_thumbs_list } from './panel_thumbs_list.mjs'

export const building_has_details = featureMeta => {
    return featureMeta && (featureMeta.images/*  || featureMeta.descr */)
}

export const show_bldg_details = (details) => {
    if (!details.images?.length) return

    create_panel_thumbs_list()
    
    const img_elements = details.images.map(name => {
        return create_lazy_image(get_image_url(name, 'thumbs'))
    })

    const details_el = document.createElement('div')
    details_el.id = 'building-details'

    img_elements.forEach(el => details_el.appendChild(el));

    panel.set_content({
        update: () => { },
        element: details_el
    })

    panel.expand()
}


export const try_open_building = (id, should_push_history = false) => {
    const featureMeta = meta[id]
    if (building_has_details(featureMeta)) {
        show_bldg_details(featureMeta)
        select_bldg(id)
        should_push_history && history.pushState(
            { id },
            "",
            `?id=${id}${window.location.hash}`
        )
    }
}