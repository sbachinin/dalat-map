import { create_lazy_image } from "../lazy-image.mjs";
import { open_slider } from "../slider/slider.mjs";
import { create_element_from_Html, get_image_url } from "../utils.mjs";

const imageFadingDuration = 160
document.documentElement.style.setProperty('--image-fading-duration', `${imageFadingDuration / 1000}s`);

export const create_panel_thumbs_list = ({
    content_description,
    images_names
}) => {
    const img_elements = images_names.map(
        name => create_lazy_image(get_image_url(name, 'thumbs'))
    )
    const list_el = create_element_from_Html(
        `<div id="panel-thumbs-list"></div>`
    )
    img_elements.forEach(el => list_el.appendChild(el))


    list_el.addEventListener('click', e => {
        const lazy_wrapper = e.target.closest('.lazy-image-wrapper')
        if (e.target.tagName !== "IMG" || !lazy_wrapper) return

        const all_images_elements = Array.from(lazy_wrapper.parentElement.children)
        open_slider({
            content_description,
            initial_index: all_images_elements.indexOf(lazy_wrapper),
            max_index: images_names.length - 1,
            get_slide(i) {
                return create_lazy_image(
                    get_image_url(images_names[i], 'large')
                )
            }
        })
    })


    return list_el
}