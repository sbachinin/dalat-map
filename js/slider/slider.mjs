import { toggle_class } from '../utils.mjs'
import { append_slides, activate_adjacent_slides } from './slider_utils.mjs'

const root_swiper_el = document.querySelector('.swiper-container')

root_swiper_el.querySelector('.close-btn').addEventListener('click', () => {
    root_swiper_el.classList.remove('visible')
    swiper.destroy()
    swiper = null
})

let swiper = null

export const open_slider = ({ initial_index, max_index, get_slide, content_description }) => {
    const content_has_changed = root_swiper_el.dataset.content_description !== content_description

    if (swiper && !swiper.destroyed && !content_has_changed) {
        swiper.slideTo(initial_index)
        root_swiper_el.classList.add('visible')
        return
    }

    // here: no swiper alive

    root_swiper_el.setAttribute('data-content_description', content_description)

    content_has_changed && append_slides(get_slide, max_index)

    toggle_class(root_swiper_el, 'with-buttons', max_index > 0)

    root_swiper_el.classList.add('visible') // important to do this before new Swiper, otherwise strange blinking on re-opening

    const options = {
        initialSlide: initial_index,
        loop: true,
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        keyboard: { enabled: true, onlyInViewport: true },
        resistance: false,
        zoom: {
            maxRatio: 3,
            minRatio: 1,
            limitToOriginalSize: true
        },
    }

    swiper = new Swiper('.swiper-container', options)

    swiper.on('slideChange', () => requestAnimationFrame(() => activate_adjacent_slides(max_index)))
    activate_adjacent_slides(max_index)
}
