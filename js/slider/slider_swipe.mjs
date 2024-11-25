import {
    set_css_num_var
} from '../utils.mjs'

const slider_el = document.querySelector('.slider')
const all_slides_el = document.querySelector('#all-slides')
const switch_slide_min_threshold = 35
const force_switch_threshold = 50 // % of  when slides must be switched even if speed was low
const drag_start_threshold = 10
const speed_threshold = 0.5

let current_swipe = null

const handle_touch_events = (
    on_touchstart,
    on_touchmove,
    on_touchend
) => {
    slider_el.addEventListener(
        'touchstart',
        on_touchstart
    )
    slider_el.addEventListener(
        'touchmove',
        on_touchmove,
        { passive: false }
    )
    slider_el.addEventListener(
        'touchend',
        on_touchend
    )
}

let swipe_was_added = false

export const try_add_swipe = (switch_slide) => {
    if (window.matchMedia("(pointer: fine)").matches) return

    if (swipe_was_added) return
    swipe_was_added = true

    set_css_num_var('--swipe-delta', '0', 'px', all_slides_el)

    const on_touchstart = async (e) => {
        if (
            e.target.closest('.slide-wrapper')
        ) {
            if (e.touches.length > 1) {
                e.preventDefault()
                return
            }

            current_swipe = {
                touch_start_XY: e.changedTouches[0],
                drag_start_coord: null,
                had_touchmove: false,
                start_time: e.timeStamp
            }
        }
    }

    const try_start_dragging = (e) => {
        if (current_swipe.drag_start_coord !== null) return true

        let delta = e.changedTouches[0].clientX - current_swipe.touch_start_XY.clientX

        if (Math.abs(delta) < drag_start_threshold) return false

        current_swipe.drag_start_coord = current_swipe.touch_start_XY.clientX
            + drag_start_threshold * Math.sign(delta)
        return true
    }

    const on_touchmove = (e) => {
        /* if (
            e.target.closest('#panel-expand-button') // prevents "navigate back" action
            || (e.target.closest('#' + get_panel_el().id) && e.touches.length > 1) // prevents pinch-related mess
        ) {
            e.preventDefault()
        } */

        if (!current_swipe) return

        current_swipe.had_touchmove = true

        all_slides_el.classList.add('notransition')

        const drag_has_begun = try_start_dragging(e)
        if (!drag_has_begun) return

        // dragging has surely begun

        const delta = e.changedTouches[0].clientX - current_swipe.drag_start_coord

        e.preventDefault()

        set_css_num_var('--swipe-delta', delta, 'px', all_slides_el)
    }


    const on_touchend = e => {
        requestAnimationFrame(() => { current_swipe = null })

        if (!current_swipe) return
        if (!current_swipe.had_touchmove) return

        all_slides_el.classList.remove('notransition')
        // maybe timeout needed
        set_css_num_var('--swipe-delta', '0', 'px', all_slides_el)
 
        switch_slide(get_slide_index_delta(e))
    }


    handle_touch_events(
        on_touchstart,
        on_touchmove,
        on_touchend
    )
}






const get_slide_index_delta = e => {
    const end_swipe_delta = e.changedTouches[0].clientX - current_swipe.drag_start_coord
    if (Math.abs(end_swipe_delta) > all_slides_el.clientWidth / 100 * force_switch_threshold) {
        // switch slide because swipe was very long, even if slow
        return -Math.sign(end_swipe_delta)
    }

    const end_touch_delta = e.changedTouches[0].clientX - current_swipe.touch_start_XY.clientX
    const end_time = e.timeStamp
    const time = end_time - current_swipe.start_time
    const speed = Math.abs(end_touch_delta) / time
    if (speed < speed_threshold) return 0
    
    const has_swiped_far = Math.abs(end_swipe_delta) > switch_slide_min_threshold
    if (has_swiped_far) {
        return -Math.sign(end_swipe_delta)
    }
    
    return 0
}