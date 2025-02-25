import { create_lazy_image } from "../lazy-image.mjs";
import { create_element_from_Html, get_image_url } from "../utils.mjs";

const imageFadingDuration = 160
document.documentElement.style.setProperty('--image-fading-duration', `${imageFadingDuration / 1000}s`);

export const panel_thumbs_list_id = 'panel-thumbs-list'

export const create_panel_thumbs_list = ({
    content_description,
    images_names
}) => {
    const img_elements = images_names.map(
        name => create_lazy_image(get_image_url(name, 'thumbs'))
    )
    const list_el = create_element_from_Html(
        `<div id="${panel_thumbs_list_id}"></div>`
    )
    img_elements.forEach(el => list_el.appendChild(el))

    return list_el
}