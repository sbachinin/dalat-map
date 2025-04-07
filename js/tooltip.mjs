// This tooltip is almost great
// It repositions itself if overflows the window
// BUT: it has no knowledge of other elements with overflow: hidden
// (or any other elements that can hide its overflowing parts)
// (in my case, panel is such an element, tooltip can't expand beyond the panel).
// So it's up to the tooltip's consumer to make sure that tooltip isn't too close to the edges of such elements,
// And "width" option is partly to ensure that tooltip is small enough not to overflow any parent

import { set_css_num_var } from "./utils/utils.mjs"

const TOOLTIP_FADE_DURATION = 400
set_css_num_var('--tooltip-fade-duration', TOOLTIP_FADE_DURATION / 1000, 's')

export const hide_tooltip = (el) => {
    if (!(el instanceof Element)) {
        el = document
    }
    el.querySelectorAll('.tooltip').forEach(ttip => ttip.classList.remove('visible'))
}

export const show_tooltip = (
    el,
    text,
    width,
    position = 'top'
) => {
    // remove old tooltip (that can be there but invible)
    // in order to forget its margins and data-position and calculate them anew
    el.querySelector('.tooltip')?.remove()

    const ttip = document.createElement('div')
    ttip.classList.add('tooltip')
    ttip.innerText = text
    ttip.style.minWidth = `${width}px`
    el.appendChild(ttip)

    ttip.dataset.position = position

    // position improvement algorithm:
    // if tooltip overflows the window on its target side, swap the target side (dataset.position)
    // if it overflows on the other axis, shift it with margin.
    // It has to be executed every time tooltip is shown
    const { top, left, right, bottom } = ttip.getBoundingClientRect()
    if (top < 0) {
        if (position === 'top') {
            ttip.dataset.position = 'bottom'
        } else {
            ttip.style.marginTop = `${-top + 10}px`
        }
    }
    if (left < 0) {
        if (position === 'left') {
            ttip.dataset.position = 'right'
        } else {
            ttip.style.marginLeft = `${-left + 10}px`
        }
    }
    if (right > window.innerWidth) {
        if (position === 'right') {
            ttip.dataset.position = 'left'
        } else {
            ttip.style.marginRight = `${right - window.innerWidth + 10}px`
        }
    }
    if (bottom > window.innerHeight) {
        if (position === 'bottom') {
            ttip.dataset.position = 'top'
        } else {
            ttip.style.marginBottom = `${bottom - window.innerHeight + 10}px`
        }
    }

    ttip.classList.add('visible')
}

export const is_tooltip_open = (el) => el.querySelector('.tooltip.visible')