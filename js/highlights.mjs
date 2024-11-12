import { panel } from './panel.mjs'
import { images_names } from './highlights_images_list.mjs'

const THUMB_IDEAL_WIDTH = 215
const THUMB_IDEAL_HEIGHT = 286

const THUMB_GAP = 4
const MAX_HIGHLIGHTS_WIDTH_RATIO = 40

/*
    NOTE
    In this function I manually decide whether to render 1 OR 2 columns but this actually can be achieved using CSS grid.
    I made it using something like grid-template-columns: repeat(...)
    But it failed in FF (it displayed always 1 column) that's why I switched to manual js solution
*/

const mouse_media_query = window.matchMedia("(pointer: fine)");

const update_size_variables = () => {
    let thumb_actual_width = THUMB_IDEAL_WIDTH
    let thumb_actual_height = THUMB_IDEAL_HEIGHT
    const is_landscape = window.innerWidth > window.innerHeight
    if (!is_landscape && mouse_media_query.matches) {
        /* In portrait & desktop, shrink the thumbs to make a nice row without empty hor space */
        const highlights_width_without_scrollbar = document.querySelector('#highlights-list').clientWidth
        const row_default_length = Math.floor(
            (highlights_width_without_scrollbar - THUMB_GAP) / (THUMB_IDEAL_WIDTH + THUMB_GAP)
        )
        thumb_actual_width = (highlights_width_without_scrollbar - THUMB_GAP) / (row_default_length + 1) - THUMB_GAP
        thumb_actual_height = thumb_actual_width * (THUMB_IDEAL_HEIGHT / THUMB_IDEAL_WIDTH)
    } else {
        thumb_actual_height = Math.min(THUMB_IDEAL_HEIGHT, window.innerHeight - THUMB_GAP * 2) // should shrink if ideal height is > 100vw
    }

    // these vars have to be set anyway because there are (can be) tiny differences btw sizes of actual image files
    document.documentElement.style.setProperty('--thumb-height', thumb_actual_height + 'px')
    document.documentElement.style.setProperty('--thumb-width', thumb_actual_width + 'px')

    const two_column_width = thumb_actual_width * 2 + THUMB_GAP * 3
    const enough_width_for_2_columns = two_column_width < window.innerWidth * MAX_HIGHLIGHTS_WIDTH_RATIO / 100
    const highlights_width_in_lanscape = enough_width_for_2_columns ? two_column_width : (two_column_width - thumb_actual_width - THUMB_GAP)

    document.documentElement.style.setProperty(
        '--highlights-width-in-landscape',
        highlights_width_in_lanscape + 'px'
    )
    document.documentElement.style.setProperty(
        '--highlights-height-in-portrait',
        (thumb_actual_height + THUMB_GAP * 2) + 'px'
    )
}

/* 
so images are of variable size
1) they shouldn't be higher than 1vh on portrait
2) should shrink a little to adjust to vport width on portrait-fine
    this must take into account the scrollbar
    i wonder if it's possible to get the "available width without scrollbar"
 */

export const display_highlights = () => {
    const imgs_html_list = images_names.map(name => {
        name = name.replace('HEIC', 'jpg')
        const { origin } = window.location
        return `<img src="${origin}/dalat-map-images/thumbs/${name}" />`
    }).join('')

    panel.set_content({
        update: update_size_variables,
        html: `<div id="highlights-list">`
            + imgs_html_list
            + `</div>`
    })

    update_size_variables()

    panel.expand()
}
