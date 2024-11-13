import { panel } from './panel.mjs'
import { images_names } from './highlights_images_list.mjs'

const THUMB_IDEAL_WIDTH = 215
const THUMB_IDEAL_HEIGHT = 286
const img_ratio = THUMB_IDEAL_WIDTH / THUMB_IDEAL_HEIGHT

const THUMB_GAP = 4
const MAX_HIGHLIGHTS_WIDTH_RATIO = 40

const set_css_var = (name, value) => {
    document.documentElement.style.setProperty(name, value)
}

set_css_var('--thumb-gap', THUMB_GAP + 'px')

const mouse_media_query = window.matchMedia("(pointer: fine)");
const is_landscape = () => window.innerWidth > window.innerHeight
let element = null

const update_size_variables = () => {
    let thumb_width = THUMB_IDEAL_WIDTH
    let thumb_height = THUMB_IDEAL_HEIGHT
    const is_portrait_desktop = !is_landscape() && mouse_media_query.matches
    if (is_portrait_desktop) {
        /* In portrait & desktop, shrink the thumbs to avoid empty hor space */
        const wrapper_width_without_scrollbar = element?.clientWidth
        const row_initial_length = Math.floor(
            (wrapper_width_without_scrollbar - THUMB_GAP) / (THUMB_IDEAL_WIDTH + THUMB_GAP)
        )
        thumb_width = (wrapper_width_without_scrollbar - THUMB_GAP) / (row_initial_length + 1) - THUMB_GAP
        thumb_height = thumb_width / img_ratio
    } else { // otherwise it can be a small device where 1 image doesn't fit into viewport height...
        thumb_height = Math.min(THUMB_IDEAL_HEIGHT, window.innerHeight - THUMB_GAP * 2)
        thumb_width = thumb_height * img_ratio
    }

    // thumb size vars have to be set anyway because there are (can be) tiny differences btw sizes of actual image files
    set_css_var('--thumb-height', thumb_height + 'px')
    set_css_var('--thumb-width', thumb_width + 'px')

    /*
    Here I manually decide whether to render 1 OR 2 columns but this actually can be achieved using CSS grid.
    I made it using something like grid-template-columns: repeat(...) + max-width
    But it failed in FF (it displayed always 1 column) that's why I switched to manual js solution
    */
    const two_column_width = thumb_width * 2 + THUMB_GAP * 3
    const enough_width_for_2_columns = two_column_width < window.innerWidth * MAX_HIGHLIGHTS_WIDTH_RATIO / 100
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

    set_css_var(
        '--highlights-width-in-landscape',
        wrapper_width_in_landscape + 'px'
    )
    set_css_var(
        '--highlights-height-in-portrait',
        wrapper_height_in_portrait + 'px'
    )
}


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

    element = document.querySelector('#highlights-list')
    update_size_variables()

    panel.expand()
}
