import { set_css_num_var } from '../utils.mjs'
import { arrow_svg } from './arrow_svg.mjs'

const SLIDER_TRANSITION_DURATION = 350

set_css_num_var('--slider-transition-duration', SLIDER_TRANSITION_DURATION / 1000, 's')

const slider_el = document.querySelector('.slider')

slider_el.querySelector('.left-button').innerHTML = arrow_svg
slider_el.querySelector('.right-button').innerHTML = arrow_svg

export const open_slider = ({ current_index, max_index, get_slide }) => {

    const wrapper_el = document.createElement('div')
    wrapper_el.className = 'slide-wrapper'
    wrapper_el.style.left = '50%'
    wrapper_el.appendChild(get_slide(current_index))
    slider_el.appendChild(wrapper_el)

    if (max_index > 1) {
        slider_el.classList.add('with-buttons')
    }
    slider_el.classList.remove('hidden')

    const switch_slide = (position_shift) => {
        const old_slides = slider_el.querySelectorAll('.slide-wrapper')

        const wrapper_el = document.createElement('div')
        wrapper_el.className = 'slide-wrapper'
        wrapper_el.style.left = 50 - position_shift + '%'
        wrapper_el.appendChild(get_slide(current_index))
        slider_el.appendChild(wrapper_el)

        // Move all slides leftwards
        requestAnimationFrame(() => {
            document.querySelectorAll('.slide-wrapper').forEach(wr => {
                wr.style.left = (parseInt(wr.style.left) + position_shift) + '%'
            })
        })

        setTimeout(() => old_slides.forEach(s => s.remove()),
            SLIDER_TRANSITION_DURATION + 50)
    }

    const handle_clicks = e => {
        if (e.target.closest('.right-button')) {
            current_index = (current_index + 1) % max_index
            switch_slide(-100)
        }
        if (e.target.closest('.left-button')) {
            current_index = (current_index - 1 + max_index) % max_index
            switch_slide(100)
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
            slider_el.removeEventListener('click', handle_clicks)
        })
    }

    slider_el.addEventListener('click', handle_clicks)
}

