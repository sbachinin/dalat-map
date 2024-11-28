import { activate_image } from '../lazy-image.mjs'
import { wrap, do_n_times, div } from '../utils.mjs'

export const append_slides = (get_slide, max_index) => {
    const wr = document.querySelector('.swiper-wrapper')
    wr.innerHTML = ''

    do_n_times(max_index, i => {
        const swiper_slide_el = div('swiper-slide')
        const zoom_wr = div('swiper-zoom-container')
        const my_slide_el = get_slide(wrap(i, 0, max_index))
        my_slide_el.classList.add('swiper-zoom-target')

        zoom_wr.appendChild(my_slide_el)        
        swiper_slide_el.appendChild(zoom_wr)
        wr.appendChild(swiper_slide_el)
    })
}

const active_slide_finished_loading = active_slide => new Promise(resolve => {
    // it can be already loaded, or is being loaded
    const lazy_active_img = active_slide.querySelector('img.lazy')
    if (lazy_active_img.classList.contains('loaded')) {
        resolve()
    } else {
        lazy_active_img.onload = () => {
            resolve()
            lazy_active_img.onload = null
        }
    }

})

export const activate_adjacent_slides = async (max_index) => {
    const active_slide = document.querySelector('.swiper-slide-active')
    if (!active_slide) return

    await active_slide_finished_loading(active_slide)

    // this is because swiper.activeSlide can hold outdated i:
    const active_index = parseInt(
        active_slide.getAttribute('data-swiper-slide-index')
    )

    const prev_index = wrap(active_index - 1, 0, max_index)
    const prev_lazy_wr = document.querySelector(`[data-swiper-slide-index="${prev_index}"] .lazy-image-wrapper`)
    prev_lazy_wr && activate_image(prev_lazy_wr)
    const next_index = wrap(active_index + 1, 0, max_index)
    const next_lazy_wr = document.querySelector(`[data-swiper-slide-index="${next_index}"] .lazy-image-wrapper`)
    next_lazy_wr && activate_image(next_lazy_wr)
}