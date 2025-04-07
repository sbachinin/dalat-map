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

let current_tooltip = null

const hide_tooltip_on_click = (e) => {
    if (!current_tooltip || current_tooltip.was_just_opened) return
    const parent_is_clicked = current_tooltip.parentEl === e.target || current_tooltip.parentEl.contains(e.target)
    if (
        !parent_is_clicked
        || current_tooltip.hide_when_parent_clicked
    ) {
        hide_tooltip()
    }
}


export const hide_tooltip = () => {
    document.querySelector('.tooltip')?.classList.remove('visible')
}

/*
    options: {
        parentEl, // needs { position:relative or similar }
        text,
        position: 'top' || 'bottom' || 'left' || 'right',
        minWidth: number,
        hide_when_parent_clicked: boolean = true // actually tapped too
    }
*/
export const show_tooltip = (options = {}) => {
    if (is_tooltip_open()) return

    options.position = options.position ?? 'top'
    options.hide_when_parent_clicked = options.hide_when_parent_clicked ?? true

    const { parentEl, minWidth, text, position } = current_tooltip = options

    // avoid click-to-close handler from closing it immediately
    current_tooltip.was_just_opened = true

    // remove old tooltip (that can be there but invible)
    // in order to forget its margins and data-position and calculate them anew
    parentEl.querySelector('.tooltip')?.remove()

    const ttip = document.createElement('div')
    ttip.classList.add('tooltip')
    ttip.innerText = text
    ttip.style.minWidth = `${minWidth}px`
    parentEl.appendChild(ttip)

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

    requestAnimationFrame(() => current_tooltip.was_just_opened = false)
}

document.addEventListener('mousedown', hide_tooltip_on_click)
document.addEventListener('touchstart', hide_tooltip_on_click)

export const is_tooltip_open = () => document.querySelector('.tooltip.visible')
