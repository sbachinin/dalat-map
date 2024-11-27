import { wrap, do_n_times } from '../utils.mjs'
import { activate_image } from '../lazy-image.mjs'


const root_swiper_el = document.querySelector('.swiper-container')

root_swiper_el.querySelector('.close-btn').addEventListener('click', () => {
    root_swiper_el.classList.remove('visible')
    swiper.destroy()
    swiper = null
})

let swiper = null

export const open_slider = ({ initial_index, max_index, get_slide, content_type }) => {
    const content_has_changed = root_swiper_el.dataset.content_type !== content_type

    if (swiper && !swiper.destroyed && !content_has_changed) {
        swiper.slideTo(initial_index)
        root_swiper_el.classList.add('visible')
        return
    }

    // here: no swiper alive

    root_swiper_el.setAttribute('data-content_type', content_type)
    const wr = document.querySelector('.swiper-wrapper')

    if (content_has_changed) {
        wr.innerHTML = ''
        do_n_times(max_index, i => {
            const swiper_slide_el = document.createElement('div')
            swiper_slide_el.className = 'swiper-slide'
            swiper_slide_el.appendChild(get_slide(wrap(i, 0, max_index))) // TODO no wrap here i think
            wr.appendChild(swiper_slide_el)
        })

    }

    root_swiper_el.classList.add('visible') // important to do this before new Swiper, otherwise strange blinking on re-opening

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

    const activate_adjacent_slides = async () => {
        const active_slide = document.querySelector('.swiper-slide-active')

        await active_slide_finished_loading(active_slide)

        // this is because swiper.activeSlide can hold outdated i:
        const active_index = parseInt(
            active_slide.getAttribute('data-swiper-slide-index')
        )

        const prev_index = wrap(active_index - 1, 0, max_index)
        const prev_lazy_wr = document.querySelector(`[data-swiper-slide-index="${prev_index}"] .lazy-image-wrapper`)
        activate_image(prev_lazy_wr)
        const next_index = wrap(active_index + 1, 0, max_index)
        const next_lazy_wr = document.querySelector(`[data-swiper-slide-index="${next_index}"] .lazy-image-wrapper`)
        activate_image(next_lazy_wr)
    }

    swiper = new Swiper('.swiper-container', {
        initialSlide: initial_index,
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        }
    })

    swiper.on('slideChange', () => requestAnimationFrame(activate_adjacent_slides))

    activate_adjacent_slides()
}
