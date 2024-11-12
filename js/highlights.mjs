import { panel } from './panel.mjs'
import { images_names } from './highlights_images_list.mjs'

const THUMB_WIDTH = 215
const THUMB_HEIGHT = 286
// there are tiny differences btw actual images size, so i set their width and height in CSS
document.documentElement.style.setProperty('--thumb-height', THUMB_HEIGHT + 'px')
document.documentElement.style.setProperty('--thumb-width', THUMB_WIDTH + 'px')

const THUMB_GAP = 4
const MAX_HIGHLIGHTS_WIDTH_RATIO = 40

/*
    NOTE
    In this function I manually decide whether to render 1 OR 2 columns but this actually can be achieved using CSS grid.
    I made it using something like grid-template-columns: repeat(...)
    But it failed in FF (it displayed always 1 column) that's why I switched to manual js solution
*/
const update_size_variables = () => {
    const two_column_width = THUMB_WIDTH * 2 + THUMB_GAP * 3
    const enough_width_for_2_columns = two_column_width < window.innerWidth * MAX_HIGHLIGHTS_WIDTH_RATIO / 100
    const highlights_width_in_lanscape = enough_width_for_2_columns ? two_column_width : (two_column_width - THUMB_WIDTH - THUMB_GAP)

    document.documentElement.style.setProperty(
        '--highlights-width-in-landscape',
        highlights_width_in_lanscape + 'px'
    )
    document.documentElement.style.setProperty(
        '--highlights-height-in-portrait',
        (THUMB_HEIGHT + THUMB_GAP * 2) + 'px'
    )
}

export const display_highlights = () => {
    const imgs_html_list = images_names.map(name => {
        name = name.replace('HEIC', 'jpg')
        const { origin } = window.location
        return `<img src="${origin}/dalat-map-images/thumbs/${name}" />`
    }).join('')

    update_size_variables()

    panel.set_content({
        update: update_size_variables,
        html: `<div id="highlights-list">`
            + imgs_html_list
            + `</div>`
    })

    panel.expand()
}
