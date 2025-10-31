import { panel, PANEL_CONTENT_TYPES } from './panel/panel.mjs'
import { debounce } from './utils/frontend_utils.mjs'
import { create_panel_thumbs_list } from './panel/panel_thumbs_list.mjs'
import { update_panel_thumbs_list_size_variables } from './panel/panel_thumbs_list_size_manager.mjs'
import { current_city } from './load_city.mjs'

const MAX_HIGHLIGHTS_WIDTH_RATIO = 40

let highlights_el = null

const update_size_variables = () => {
    update_panel_thumbs_list_size_variables({
        max_width_ratio: MAX_HIGHLIGHTS_WIDTH_RATIO
    })
}

const scroll_pos = [0, 0]

export const display_highlights = () => {

    highlights_el = highlights_el || create_panel_thumbs_list({
        images_basenames: current_city.highlights_order,
        content_type: PANEL_CONTENT_TYPES.HIGHLIGHTS
    })

    panel.set_content({
        update_size: update_size_variables,
        element: highlights_el,
        id: 'highlights'
    })

    panel.on('scroll', 'highlights list', debounce(e => {
        if (panel.content.id === 'highlights') {
            scroll_pos[0] = e.target.scrollLeft
            scroll_pos[1] = e.target.scrollTop
        }
    }))

    panel.on('content was just set', 'highlights list', new_content => {
        if (new_content.id === 'highlights') {
            panel.body_element.scrollLeft = scroll_pos[0]
            panel.body_element.scrollTop = scroll_pos[1]
        }
    })
}
