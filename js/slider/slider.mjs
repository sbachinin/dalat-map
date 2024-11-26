import { debounce, wrap, set_css_num_var, get_css_var_num, do_n_times } from '../utils.mjs'
import { arrow_svg } from './arrow_svg.mjs'
import { try_add_swipe } from './slider_swipe.mjs'
import { activate_image } from '../lazy-image.mjs'


/*
const insert_slide = index => {
    const slide_el = document.createElement('div')
    slide_el.className = 'slide-wrapper'
    slide_el.style.setProperty('--slide-index', index);
    slide_el.appendChild(
        current_slider.get_slide(wrap(index, 0, current_slider.max_index))
    )
    all_slides_el.appendChild(slide_el)

    return {
        wrapper_el: slide_el,
        img_el: slide_el.querySelector('img')
    }
}

const insert_slide_and_try_activate_img = i => {
    const slide = insert_slide(i)
    const lazy_wrapper = slide.wrapper_el.querySelector('.lazy-image-wrapper')
    lazy_wrapper && activate_image(lazy_wrapper)
    return slide
}


const remove_far_slides = debounce(() => {
    const current_slide_index = get_css_var_num('--current-slide-index')
    slider_el.querySelectorAll('.slide-wrapper').forEach(s => {
        const slide_index = get_css_var_num('--slide-index', s)
        const index_diff = Math.round(Math.abs(slide_index - current_slide_index))
        const is_near = (
            slide_index === current_slide_index
            || index_diff === 1
            || index_diff === current_slider.max_index
        )
        !is_near && s.remove()
    })
}, 500)

const _wrap = num => wrap(num, 0, current_slider.max_index)
 */

const root_swiper_el = document.querySelector('.swiper-container')

root_swiper_el.querySelector('.close-btn').addEventListener('click', () => {
    root_swiper_el.classList.remove('visible')
    swiper.destroy()
    swiper = null
})

let swiper = null

export const open_slider = ({ initial_index, max_index, get_slide, content_type }) => {
    if (swiper && !swiper.destroyed && root_swiper_el.dataset.content_type === content_type) {
        swiper.slideTo(initial_index)
        root_swiper_el.classList.add('visible')
        return
    }
    
    root_swiper_el.setAttribute('data-content_type', content_type)
    const wr = document.querySelector('.swiper-wrapper')

    do_n_times(max_index, i => {
        const swiper_slide_el = document.createElement('div')
        swiper_slide_el.className = 'swiper-slide'
        swiper_slide_el.appendChild(get_slide(wrap(i, 0, max_index)))
        wr.appendChild(swiper_slide_el)
    })

    swiper = new Swiper('.swiper-container', {
        initialSlide: initial_index,
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    })

    root_swiper_el.classList.add('visible')

    return

    // img_el.onload = () => {
    //     insert_slide_and_try_activate_img(_wrap(initial_index - 1))
    //     insert_slide_and_try_activate_img(_wrap(initial_index + 1))
    // }
}
