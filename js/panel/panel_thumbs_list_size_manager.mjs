import { set_css_num_var, is_landscape, is_mouse_device } from '../utils.mjs'
import { get_panel_el } from './panel_utils.mjs'

export const THUMB_GAP = 4
set_css_num_var('--thumb-gap', THUMB_GAP, 'px')

const THUMB_IDEAL_WIDTH = 215
const THUMB_IDEAL_HEIGHT = 286
const img_ratio = THUMB_IDEAL_WIDTH / THUMB_IDEAL_HEIGHT


export const update_panel_thumbs_list_size_variables = (
    {
        max_width_ratio
    }
) => {
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

    /* Here I manually decide whether to render 1 OR 2 columns but this actually can be achieved using CSS grid.
    I made it using something like grid-template-columns: repeat(...) + max-width
    But it failed in FF (it displayed always 1 column) that's why I switched to manual js solution
    */
    const two_column_width = thumb_width * 2 + THUMB_GAP * 3
    const enough_width_for_2_columns = two_column_width < window.innerWidth * max_width_ratio / 100
    let wrapper_width_in_landscape = two_column_width
    if (!enough_width_for_2_columns) {
        wrapper_width_in_landscape -= (thumb_width + THUMB_GAP)
    }

    let wrapper_height_in_portrait = (thumb_height + THUMB_GAP * 2)

    if (is_portrait_desktop) { // try to show >1 row if enough height
        wrapper_height_in_portrait = Math.min(
            wrapper_height_in_portrait * 1.5,
            window.innerHeight * 0.35
        )
    }

    set_css_num_var(
        '--highlights-width-in-landscape',
        wrapper_width_in_landscape,
        'px'
    )
    set_css_num_var(
        '--highlights-height-in-portrait',
        wrapper_height_in_portrait,
        'px'
    )
}