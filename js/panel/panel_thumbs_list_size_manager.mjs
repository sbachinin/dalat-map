import { set_css_num_var } from '../utils/frontend_utils.mjs'
import { panel_thumbs_list_id } from './panel_thumbs_list.mjs'

export const THUMB_GAP = 7
set_css_num_var('--thumb-gap', THUMB_GAP, 'px')

const THUMB_IDEAL_WIDTH = 215
const THUMB_IDEAL_HEIGHT = 286
const img_ratio = THUMB_IDEAL_WIDTH / THUMB_IDEAL_HEIGHT


export const update_panel_thumbs_list_size_variables = ({
    max_width_ratio
}) => {

    let thumb_ideal_width = THUMB_IDEAL_WIDTH
    let thumb_ideal_height = THUMB_IDEAL_HEIGHT
    // on a small device 1 image can be higher than viewport...
    thumb_ideal_height = Math.min(THUMB_IDEAL_HEIGHT, window.innerHeight - THUMB_GAP * 2)
    thumb_ideal_width = thumb_ideal_height * img_ratio



    /* Here I manually decide whether to render 1 OR 2 columns but this actually can be achieved using CSS grid.
    I made it using something like grid-template-columns: repeat(...) + max-width
    But it failed in FF (it displayed always 1 column) that's why I switched to manual js solution
    */
    const one_column_width = thumb_ideal_width + THUMB_GAP * 2
    const two_columns_width = thumb_ideal_width * 2 + THUMB_GAP * 3
    let width_in_landscape = one_column_width
    const enough_width_for_2cols = two_columns_width < window.innerWidth * max_width_ratio / 100
    const should_try_to_expand_to_2_cols = document.querySelectorAll(`#${panel_thumbs_list_id} img`).length > 5
    if (should_try_to_expand_to_2_cols && enough_width_for_2cols) {
        width_in_landscape += thumb_ideal_width + THUMB_GAP
    }





    set_css_num_var(
        '--thumbs-list-width-in-landscape',
        width_in_landscape,
        'px'
    )
    set_css_num_var(
        '--thumbs-list-height-in-portrait',
        thumb_ideal_height + THUMB_GAP * 2,
        'px'
    )
}