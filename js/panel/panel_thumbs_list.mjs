import { create_lazy_image } from "../lazy-image.mjs";
import { bldg_link_html } from "../link_appender_to_photoswipe.mjs";
import { create_element_from_Html, get_image_url, is_mouse_device } from "../utils.mjs";
import { panel, PANEL_CONTENT_TYPES } from "./panel.mjs";

const imageFadingDuration = 160
document.documentElement.style.setProperty('--image-fading-duration', `${imageFadingDuration / 1000}s`);

export const panel_thumbs_list_id = 'panel-thumbs-list'

const initialize_bldg_link_appender = el => {
    el.addEventListener('mouseenter', () => {
        if (panel.content.type !== PANEL_CONTENT_TYPES.HIGHLIGHTS) return

        const bldg_link_el = create_element_from_Html(bldg_link_html)
        bldg_link_el.setAttribute('img-src', el.querySelector('img').src)
        el.appendChild(bldg_link_el)
        setTimeout(() => {
            bldg_link_el.style.opacity = 1
        }, 50)
    })
    el.addEventListener('mouseleave', () => {
        const bldg_link_el = el.querySelector('.bldg-link')
        if (!bldg_link_el) return
        bldg_link_el.style.opacity = 0
        setTimeout(() => bldg_link_el.remove(), 400)
    })
}

export const create_panel_thumbs_list = ({ images_names }) => {
    const img_elements = images_names.map(
        name => create_lazy_image(get_image_url(name, 'thumbs'))
    )
    const list_el = create_element_from_Html(
        `<div id="${panel_thumbs_list_id}"></div>`
    )
    img_elements.forEach(el => {
        if (is_mouse_device()) initialize_bldg_link_appender(el)

        list_el.appendChild(el)
    })

    return list_el
}