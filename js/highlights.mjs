import { panel } from './panel.mjs'
import { images_names } from './highlights_images_list.mjs'

const THUMB_WIDTH = 215
const THUMB_HEIGHT = 286
const THUMB_GAP = 4
const SCROLLBAR_WIDTH = 7
const MAX_HIGHLIGHTS_WIDTH_RATIO = 40

/*
    NOTE
    In this function I manually decide whether to render 1 OR 2 columns but this actually can be achieved using CSS grid.
    I made it using something like grid-template-columns: repeat(...)
    But it failed in FF (it displayed always 1 column) that's why I switched to manual js solution
*/
const get_highlights_panel_size = () => {
    // only on landscape
    const two_column_width = THUMB_WIDTH * 2 + THUMB_GAP * 3 + SCROLLBAR_WIDTH
    const enough_width_for_2_columns = two_column_width < window.innerWidth * MAX_HIGHLIGHTS_WIDTH_RATIO / 100
    const width = enough_width_for_2_columns ? two_column_width : (two_column_width - THUMB_WIDTH - THUMB_GAP)

    return {
        width: width + 'px',
        height: (THUMB_HEIGHT + THUMB_GAP * 2) + 'px'
    }
}

export const display_highlights = () => {
    const imgs_html_list = images_names.map(name => {
        name = name.replace('HEIC', 'jpg')
        const { origin } = window.location

        return `<img src="${origin}/dalat-map-images/thumbs/${name}" />`
    }).join('')

    panel.insert_HTML(
        `<div id="highlights-list">`
        + imgs_html_list
        + `</div>`
    )

    panel.expand(get_highlights_panel_size())
}
