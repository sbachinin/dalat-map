import { panel } from './panel/panel.mjs'
import { images_names } from './highlights_images_list.mjs'
import { create_lazy_image } from './lazy-image.mjs'
import { set_css_num_var, get_image_url, is_landscape, is_mouse_device } from './utils.mjs'
import { open_slider } from './slider/slider.mjs'
import { THUMB_GAP, update_thumb_size_variables } from './thumb_size.mjs'

const MAX_HIGHLIGHTS_WIDTH_RATIO = 40

let highlights_el = null

const update_size_variables = () => {
    const { thumb_width, thumb_height } = update_thumb_size_variables()

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

    const is_portrait_desktop = !is_landscape() && is_mouse_device()
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
            initial_index: all_images_elements.indexOf(lazy_wrapper),
            max_index: images_names.length - 1,
            get_slide(i) {
                return create_lazy_image(
                    get_image_url(images_names[i], 'large')
                )
            }
        })
    })

    panel.expand()

    const url_without_id = window.location.origin + window.location.pathname + window.location.hash
    history.pushState({ id: null }, "", url_without_id)
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