import { panel, PANEL_CONTENT_TYPES } from './panel/panel.mjs'
import { images_names } from './highlights_images_list.mjs'
import { get_image_url, push_to_history } from './utils.mjs'
import { create_panel_thumbs_list } from './panel/panel_thumbs_list.mjs'
import { update_panel_thumbs_list_size_variables } from './panel/panel_thumbs_list_size_manager.mjs'
import { select_bldg } from './select_building.mjs'

const MAX_HIGHLIGHTS_WIDTH_RATIO = 40

let highlights_el = null

const update_size_variables = () => {
    update_panel_thumbs_list_size_variables({
        max_width_ratio: MAX_HIGHLIGHTS_WIDTH_RATIO
    })
}

export const display_highlights = (should_push_history = false) => {
    select_bldg(null)

    highlights_el = highlights_el || create_panel_thumbs_list({
        images_names
    })

    panel.set_content({
        update: update_size_variables,
        element: highlights_el,
        type: PANEL_CONTENT_TYPES.HIGHLIGHTS
    })

    update_size_variables()

    panel.expand()

    const url_without_id = window.location.origin + window.location.pathname + window.location.hash
    if (should_push_history) {
        push_to_history({ id: null }, url_without_id)
    }
}

// TODO benefits of this are not apparent; and it can slow the initial load too
export const preload_some_images = () => {
    for (let i = 0; i < 10; i++) {
        if (images_names[i]) {
            let img = new Image()
            img.src = get_image_url(images_names[i], 'thumbs')
        }
    }
}