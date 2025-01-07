import { get_panel_el } from './panel/panel_utils.mjs'
import { is_landscape, is_mouse_device, set_css_num_var } from './utils.mjs'

export const THUMB_GAP = 4
set_css_num_var('--thumb-gap', THUMB_GAP, 'px')

const THUMB_IDEAL_WIDTH = 215
const THUMB_IDEAL_HEIGHT = 286
const img_ratio = THUMB_IDEAL_WIDTH / THUMB_IDEAL_HEIGHT


export const update_thumb_size_variables = () => {
    let thumb_width = THUMB_IDEAL_WIDTH
    let thumb_height = THUMB_IDEAL_HEIGHT
    const is_portrait_desktop = !is_landscape() && is_mouse_device()
    const panel_content_el = get_panel_el().firstElementChild
    if (is_portrait_desktop && !!panel_content_el) {
        /* In portrait & desktop, shrink the thumbs to avoid empty hor space */
        const wrapper_width_without_scrollbar = panel_content_el.clientWidth
        const row_initial_length = Math.floor(
            (wrapper_width_without_scrollbar - THUMB_GAP) / (THUMB_IDEAL_WIDTH + THUMB_GAP)
        )
        thumb_width = (wrapper_width_without_scrollbar - THUMB_GAP) / (row_initial_length + 1)
            - THUMB_GAP
            - /* otherwise some occasional bad wrapping */ 0.5
        thumb_width = (wrapper_width_without_scrollbar - THUMB_GAP) / (row_initial_length + 1) - THUMB_GAP - 0.5
        thumb_width = (wrapper_width_without_scrollbar - THUMB_GAP) / (row_initial_length + 1)
            - THUMB_GAP
            - /* otherwise some occasional bad wrapping */ 0.5
        thumb_height = thumb_width / img_ratio
    } else { // otherwise it can be a small device where 1 image doesn't fit into viewport height...
        thumb_height = Math.min(THUMB_IDEAL_HEIGHT, window.innerHeight - THUMB_GAP * 2)
        thumb_width = thumb_height * img_ratio
    }

    // thumb size vars have to be set anyway because there are (can be) tiny differences btw sizes of actual image files
    set_css_num_var('--thumb-height', thumb_height, 'px')
    set_css_num_var('--thumb-width', thumb_width, 'px')

    return { thumb_width, thumb_height }
}