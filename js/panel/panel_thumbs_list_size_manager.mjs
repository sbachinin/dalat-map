import { set_css_num_var, is_landscape, is_mouse_device } from '../utils.mjs'
import { panel } from './panel.mjs'
import { panel_thumbs_list_id } from './panel_thumbs_list.mjs'

export const THUMB_GAP = 4
set_css_num_var('--thumb-gap', THUMB_GAP, 'px')

const THUMB_IDEAL_WIDTH = 215
const THUMB_IDEAL_HEIGHT = 286
const img_ratio = THUMB_IDEAL_WIDTH / THUMB_IDEAL_HEIGHT


export const update_panel_thumbs_list_size_variables = ({
    max_width_ratio
}) => {
    const is_portrait_desktop = !is_landscape() && is_mouse_device





    // In portrait & desktop, shrink the thumbs to avoid empty hor space
    
    let thumb_width = THUMB_IDEAL_WIDTH
    let thumb_height = THUMB_IDEAL_HEIGHT
    if (is_portrait_desktop && panel.content?.element) {
        const wrapper_width_without_scrollbar = panel.content.element.clientWidth
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
    const one_column_width = thumb_width + THUMB_GAP * 2
    const two_columns_width = thumb_width * 2 + THUMB_GAP * 3
    let width_in_landscape = one_column_width
    const enough_width_for_2cols = two_columns_width < window.innerWidth * max_width_ratio / 100
    const should_try_to_expand_to_2_cols = document.querySelectorAll(`#${panel_thumbs_list_id} img`).length > 5
    if (should_try_to_expand_to_2_cols && enough_width_for_2cols) {
        width_in_landscape += thumb_width + THUMB_GAP
    }





    set_css_num_var(
        '--thumbs-list-width-in-landscape',
        width_in_landscape,
        'px'
    )
    set_css_num_var(
        '--thumbs-list-height-in-portrait',
        thumb_height + THUMB_GAP * 2,
        'px'
    )
}