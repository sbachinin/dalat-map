// This tooltip is almost great
// It repositions itself if overflows the window
// BUT: it has no knowledge of other elements with overflow: hidden
// (or any other elements that can hide its overflowing parts)
// (in my case, panel is such an element, tooltip can't expand beyond the panel).
// So it's up to the tooltip's consumer to make sure that tooltip isn't too close to the edges of such elements,
// And "width" option is partly to ensure that tooltip is small enough not to overflow any parent

import { set_css_num_var } from "./utils/utils.mjs"

const margin_px = 10
let close_timeout = null
const TOOLTIP_FADE_DURATION = 400
set_css_num_var('--tooltip-fade-duration', TOOLTIP_FADE_DURATION / 1000, 's')

let current_tooltip = null

const hide_tooltip_on_click = (e) => {
    if (!current_tooltip || current_tooltip.was_just_opened) return
    const parent_is_clicked = current_tooltip.ownerEl === e.target || current_tooltip.ownerEl.contains(e.target)
    if (
        !parent_is_clicked
        || current_tooltip.hide_when_parent_clicked
    ) {
        hide_tooltip()
    }
}


export const hide_tooltip = () => {
    clearTimeout(close_timeout)
    document.querySelector('.unique-tooltip')?.classList.remove('visible')
    current_tooltip.ownerEl.removeEventListener('mouseleave', hide_tooltip)
}

/*
    options: {
        ownerEl, // needs { position:relative or similar }
        boundingEl, // an element that tooltip should not overflow
        text,
        position: 'top' || 'bottom' || 'left' || 'right',
        minWidth: number,
        hide_when_parent_clicked: boolean = true // actually tapped too
        closeAfter: number, // ms
        closeOnMouseleave: boolean
    }
*/
export const show_tooltip = (options = {}) => {

    clearTimeout(close_timeout)
    if (options.closeAfter) { // even if tooltip is already open, start timeout afresh
        close_timeout = setTimeout(hide_tooltip, 5000)
    }

    if (is_tooltip_open()) return

    options.position = options.position ?? 'top'
    options.hide_when_parent_clicked = options.hide_when_parent_clicked ?? true
    options.minWidth = options.minWidth ?? 0
    if (options.boundingEl instanceof HTMLElement) {
        options.minWidth = Math.min(options.minWidth, options.boundingEl.offsetWidth - margin_px * 2)
    }

    const { ownerEl, boundingEl, minWidth, text, position } = current_tooltip = options

    // avoid click-to-close handler from closing it immediately
    current_tooltip.was_just_opened = true

    // remove old tooltip (that can be there but invible)
    // in order to forget its margins and data-position and calculate them anew
    ownerEl.querySelector('.unique-tooltip')?.remove()

    const ttip = document.createElement('div')
    ttip.classList.add('unique-tooltip')
    ttip.innerText = text

    ttip.style.minWidth = `${minWidth}px`
    ttip.style.maxHeight = `${boundingEl.offsetHeight - margin_px * 2}px`

    ownerEl.appendChild(ttip)

    ttip.dataset.position = position




    // Position improvement algorithm:
    // It has to be executed every time tooltip is shown
    // 1. If tooltip overflows the window on its target side, swap the target side (dataset.position)
    // If it overflows on the "other axis", shift it with margin.
    // 2. Check the new position, if on the "main axis" it still overflows,
    // rollback to the original dataset.position and shift it with margin
    // TODO This has to be more thoroughly tested, independently of map, cases are many
    const { top_overflow, right_overflow, bottom_overflow, left_overflow } = get_element_overflow(ttip, boundingEl, margin_px)

    if (top_overflow) {
        if (position === 'top') {
            ttip.dataset.position = 'bottom'
            const new_bottom_overflow = get_element_overflow(ttip, boundingEl, margin_px).bottom_overflow
            if (new_bottom_overflow) {
                ttip.dataset.position = 'top'
                ttip.style.marginBottom = `-${top_overflow}px`
            }
        } else {
            ttip.style.marginTop = `${top_overflow}px` // marginTop/marginBottom inversion is important here
        }
    }
    if (left_overflow) {
        if (position === 'left') {
            ttip.dataset.position = 'right'
            const new_right_overflow = get_element_overflow(ttip, boundingEl, margin_px).right_overflow
            if (new_right_overflow) {
                ttip.dataset.position = 'left'
                ttip.style.marginRight = `-${left_overflow}px`
            }
        } else {
            ttip.style.marginLeft = `${left_overflow}px` // marginRight/marginLeft inversion is important here
        }
    }
    if (right_overflow) {
        if (position === 'right') {
            ttip.dataset.position = 'left'
            const new_left_overflow = get_element_overflow(ttip, boundingEl, margin_px).left_overflow
            if (new_left_overflow) {
                ttip.dataset.position = 'right'
                ttip.style.marginLeft = `-${right_overflow}px`
            }
        } else {
            ttip.style.marginLeft = `-${right_overflow}px`
        }
    }
    if (bottom_overflow) {
        if (position === 'bottom') {
            ttip.dataset.position = 'top'
            const new_top_overflow = get_element_overflow(ttip, boundingEl, margin_px).top_overflow
            if (new_top_overflow) {
                ttip.dataset.position = 'bottom'
                ttip.style.marginTop = `-${bottom_overflow}px`
            }
        } else {
            ttip.style.marginTop = `-${bottom_overflow}px`
        }
    }

    ttip.classList.add('visible')

    requestAnimationFrame(() => current_tooltip.was_just_opened = false)

    if (options.closeOnMouseleave && window.matchMedia("(pointer: fine)").matches) {
        ownerEl.addEventListener('mouseleave', hide_tooltip)
    }
}

document.addEventListener('mousedown', hide_tooltip_on_click)
document.addEventListener('touchstart', hide_tooltip_on_click)

export const is_tooltip_open = () => document.querySelector('.unique-tooltip.visible')


// return { top_overflow, right_overflow, bottom_overflow, left_overflow }
// where values are positive integers if there is actual overflow
// or 0 if there is no overflow
// If bounding_el is omitted, return overflow from documentElement
const get_element_overflow = (el, bounding_el, margin = 10) => {
    const el_rect = el.getBoundingClientRect();

    let bounding_rect = {
        top: 0,
        right: document.documentElement.clientWidth, // without scrollbar
        bottom: document.documentElement.clientHeight,
        left: 0
    }
    if (bounding_el) {
        bounding_rect = bounding_el.getBoundingClientRect();
    }

    return {
        top_overflow: Math.max(0, bounding_rect.top - el_rect.top + margin),
        right_overflow: Math.max(0, el_rect.right - bounding_rect.right + margin),
        bottom_overflow: Math.max(0, el_rect.bottom - bounding_rect.bottom + margin),
        left_overflow: Math.max(0, bounding_rect.left - el_rect.left + margin)
    }
}