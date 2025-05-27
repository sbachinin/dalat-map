import { panel, PANEL_CONTENT_TYPES } from './panel/panel.mjs'
import { debounce, push_to_history } from './utils/utils.mjs'
import { create_panel_thumbs_list } from './panel/panel_thumbs_list.mjs'
import { update_panel_thumbs_list_size_variables } from './panel/panel_thumbs_list_size_manager.mjs'
import { select_building } from './select_building.mjs'
import { current_city } from './load_city.mjs'

const MAX_HIGHLIGHTS_WIDTH_RATIO = 40

let highlights_el = null

const update_size_variables = () => {
    update_panel_thumbs_list_size_variables({
        max_width_ratio: MAX_HIGHLIGHTS_WIDTH_RATIO
    })
}

const scroll_pos = [0, 0]

export const display_highlights = (should_push_history = false) => {

    select_building(null)

    highlights_el = highlights_el || create_panel_thumbs_list({
        images_names: current_city.highlights_order,
        content_type: PANEL_CONTENT_TYPES.HIGHLIGHTS
    })

    panel.set_content({
        update_size: update_size_variables,
        element: highlights_el,
        type: PANEL_CONTENT_TYPES.HIGHLIGHTS
    })

    const url_without_id = window.location.origin + window.location.pathname + window.location.hash
    if (should_push_history) {
        push_to_history({ id: null }, url_without_id)
    }

    panel.on('scroll', 'highlights list', debounce(e => {
        if (panel.content.type === PANEL_CONTENT_TYPES.HIGHLIGHTS) {
            scroll_pos[0] = e.target.scrollLeft
            scroll_pos[1] = e.target.scrollTop
        }
    }))

    panel.on('content was just set', 'highlights list', new_content => {
        if (new_content.type === PANEL_CONTENT_TYPES.HIGHLIGHTS) {
            panel.body_element.scrollLeft = scroll_pos[0]
            panel.body_element.scrollTop = scroll_pos[1]
        }
    })
}
