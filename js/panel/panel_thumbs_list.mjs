import { create_lazy_image } from "../lazy-image.mjs";
import { bldg_link_html } from "../photoswipe_mutations_observer.mjs";
import { create_element_from_Html, get_image_url, is_mouse_device } from "../utils.mjs";
import { PANEL_CONTENT_TYPES } from "./panel.mjs";

const imageFadingDuration = 160
document.documentElement.style.setProperty('--image-fading-duration', `${imageFadingDuration / 1000}s`);

export const panel_thumbs_list_id = 'panel-thumbs-list'

export const create_panel_thumbs_list = ({ images_names, content_type = PANEL_CONTENT_TYPES.BUILDING }) => {
    const slide_els = images_names.map(
        name => {
            const wr = create_element_from_Html(`<div class="slide-wrapper"></div>`)
            wr.appendChild(create_lazy_image(get_image_url(name, 'thumbs')))
            return wr
        }
    )
    const list_el = create_element_from_Html(
        `<div id="${panel_thumbs_list_id}"></div>`
    )

    slide_els.forEach(el => {
        list_el.appendChild(el)
        if (is_mouse_device && content_type === PANEL_CONTENT_TYPES.HIGHLIGHTS) {
            const bldg_link_el = create_element_from_Html(bldg_link_html)
            const img = el.querySelector('img')
            bldg_link_el.setAttribute('img-src', img.src || img.dataset.src)
            el.appendChild(bldg_link_el)
        }
    })

    return list_el
}