import { debounce, wrap, set_css_num_var, get_css_var_num } from '../utils.mjs'
import { arrow_svg } from './arrow_svg.mjs'
import { try_add_swipe } from './slider_swipe.mjs'
import { activate_image } from '../lazy-image.mjs'

const SLIDER_TRANSITION_DURATION = 350
set_css_num_var('--slider-transition-duration', SLIDER_TRANSITION_DURATION / 1000, 's')

const slider_el = document.querySelector('.slider')
const all_slides_el = document.querySelector('#all-slides')

slider_el.querySelector('.left-button').innerHTML = arrow_svg
slider_el.querySelector('.right-button').innerHTML = arrow_svg

let current_slider


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

const switch_slide = a_change => {
    if (a_change === 0) return

    const new_current_index = get_css_var_num('--current-slide-index') + a_change
    set_css_num_var(
        '--current-slide-index',
        new_current_index,
        '')

    // insert new neighbor
    insert_slide_and_try_activate_img(
        new_current_index + a_change)

    remove_far_slides()
}

const handle_clicks = e => {
    const { current_index, max_index } = current_slider
    if (e.target.closest('.right-button')) {
        switch_slide(1)
    }
    if (e.target.closest('.left-button')) {
        switch_slide(-1)
    }

    requestAnimationFrame(() => { // TODO why?
        if (
            e.target.tagName === "IMG"
            || e.target.closest('.right-button')
            || e.target.closest('.left-button')
        ) return
        document.querySelectorAll('.slide-wrapper').forEach(el => el.remove())
        slider_el.classList.remove('with-buttons')
        slider_el.classList.add('hidden')
    })
}


slider_el.addEventListener('click', handle_clicks)

export const open_slider = ({ current_index, max_index, get_slide }) => {

    set_css_num_var('--current-slide-index', current_index, '')

    current_slider = { current_index, max_index, get_slide }

    all_slides_el.querySelectorAll('.slide-wrapper').forEach(sw => sw.remove())

    const { img_el } = insert_slide(current_index)
    img_el.onload = () => {
        insert_slide_and_try_activate_img(_wrap(current_index - 1))
        insert_slide_and_try_activate_img(_wrap(current_index + 1))
    }

    if (max_index > 1) {
        slider_el.classList.add('with-buttons')
    }
    slider_el.classList.remove('hidden')

    try_add_swipe(switch_slide)
}
