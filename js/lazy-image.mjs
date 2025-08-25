import { current_city } from "./load_city.mjs"
import { create_element_from_Html } from "./utils/frontend_utils.mjs"

const do_once_visible = (el, cb) => {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                cb()
                observer.unobserve(el)
            }
        })
    }, { threshold: 0.1 })
    observer.observe(el)
}

export const activate_image = (el) => {
    const img = el.querySelector('img')
    if (img.classList.contains('loaded')) return

    const loader = el.querySelector('.img-loader')
    img.src = img.dataset.src
    loader.style.display = 'block'

    img.oncontextmenu = e => e.preventDefault()

    img.addEventListener('load', function () {
        loader.style.display = 'none'
        img.classList.add('loaded')
    });
}

export const create_lazy_image = src => {
    const filename = src.split('/').pop()
    const el = create_element_from_Html(
        `<a class='lazy-image-wrapper'
            data-pswp-src="${src.replace('thumbs', 'large')}"
            data-pswp-width="${current_city.images_sizes[filename]?.[0]}"
            data-pswp-height="${current_city.images_sizes[filename]?.[1]}"
        >
            <div class="img-loader" style="display: none"></div>
            <img data-src="${src}" class="lazy">
        </a>`
    )
    do_once_visible(el, () => activate_image(el))
    return el
}
