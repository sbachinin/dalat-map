import { panel } from './panel/panel.mjs'
import { images_names } from './highlights_images_list.mjs'
import { create_lazy_image } from './lazy-image.mjs'
import { is_landscape, set_css_num_var, get_image_url } from './utils.mjs'
import { open_slider } from './slider/slider.mjs'

const THUMB_IDEAL_WIDTH = 215
const THUMB_IDEAL_HEIGHT = 286
const img_ratio = THUMB_IDEAL_WIDTH / THUMB_IDEAL_HEIGHT

const THUMB_GAP = 4
const MAX_HIGHLIGHTS_WIDTH_RATIO = 40

set_css_num_var('--thumb-gap', THUMB_GAP, 'px')

const is_mouse_device = window.matchMedia("(pointer: fine)").matches
let highlights_el = null

const update_size_variables = () => {
    let thumb_width = THUMB_IDEAL_WIDTH
    let thumb_height = THUMB_IDEAL_HEIGHT
    const is_portrait_desktop = !is_landscape() && is_mouse_device
    if (is_portrait_desktop) {
        /* In portrait & desktop, shrink the thumbs to avoid empty hor space */
        const wrapper_width_without_scrollbar = highlights_el?.clientWidth
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
    set_css_num_var('--thumb-height', thumb_height, 'px')
    set_css_num_var('--thumb-width', thumb_width, 'px')

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

export const display_highlights = () => {
    const img_elements = images_names.map(name => {
        return create_lazy_image(get_image_url(name, 'thumbs'))
    })

    highlights_el = document.createElement('div')
    highlights_el.id = 'highlights-list'

    img_elements.forEach(el => highlights_el.appendChild(el));

    panel.set_content({
        update: update_size_variables,
        element: highlights_el
    })

    update_size_variables()

    highlights_el.addEventListener('click', e => {
        const lazy_wrapper = e.target.closest('.lazy-image-wrapper')
        if (e.target.tagName !== "IMG" || !lazy_wrapper) return

        const all_images_elements = Array.from(lazy_wrapper.parentElement.children)
        open_slider({
            content_type: 'highlights',
            current_index: all_images_elements.indexOf(lazy_wrapper),
            max_index: images_names.length - 1,
            get_slide(i) {
                return create_lazy_image(
                    get_image_url(images_names[i], 'large')
                )
            }
        })
    })

    panel.expand()
}

// TODO benefits of this are not apparent; and it can slow the initial load too
export const preload_some_images = () => {
    for (let i = 0; i < 10; i++) {
        if (images_names[i]) {
            let img = new Image()
            img.src = get_image_url(images_names[i], 'thumbs')
        }
    }
}