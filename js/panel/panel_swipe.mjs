import {
    is_landscape,
    within,
    get_css_var_num
} from '../utils.mjs'

import {
    get_panel_el
} from './panel_utils.mjs'

const swipe_expand_threshold = 50
const drag_start_threshold = 10

let current_swipe = null

get_panel_el().addEventListener('scroll', () => {
    // TODO this will be fired all the time even if there was no swipe at all; even if it's not a touch devcice
    if (current_swipe) {
        current_swipe.content_was_scrolled = true
    }
})

export const make_expandable_on_swipe = (set_size) => {
    document.addEventListener('touchstart', (e) => {
        if (
            e.target.closest('#' + get_panel_el().id)
            || e.target.closest('#panel-expand-button')
        ) {
            current_swipe = {
                panel_start_size: get_css_var_num('--panel-size'),
                panel_full_size: get_css_var_num('--panel-full-size'),
                touch_start: e.changedTouches[0][is_landscape() ? 'clientX' : 'clientY'],
                drag_start_threshold_was_passed: false,
                initial_scroll_pos: get_panel_el()[is_landscape() ? 'scrollTop' : 'scrollLeft'],
                is_landscape: is_landscape(),
                content_was_scrolled: false,
                had_touchmove: false
            }
        }
    }, false)

    document.addEventListener('touchend', (e) => {
        get_panel_el().parentElement.classList.remove('notransition')

        setTimeout(() => { current_swipe = null })

        if (
            !current_swipe
            || !current_swipe.had_touchmove
            || current_swipe.content_was_scrolled
        ) return

        const touch_end = e.changedTouches[0][current_swipe.is_landscape ? 'clientX' : 'clientY']
        // TODO is this final coord affecting the position?

        const current_size = get_css_var_num('--panel-size')
        if (current_size === current_swipe.panel_start_size) return // TODO maybe this can be safely removed now

        // if swipe was tiny, try to return to original state:
        let should_expand = current_size > (current_swipe.panel_full_size / 2)

        // if swipe was long, change the state:
        let end_delta = touch_end - current_swipe.touch_start
        if (!current_swipe.is_landscape) end_delta = -end_delta

        const has_swiped_far = Math.abs(end_delta) > swipe_expand_threshold
        if (has_swiped_far) {
            should_expand = end_delta > 0
        }

        set_size(should_expand ? current_swipe.panel_full_size : 0)
    }, false);

    document.addEventListener('touchmove', (e) => {
        if (!current_swipe || current_swipe.content_was_scrolled) return

        current_swipe.had_touchmove = true

        get_panel_el().parentElement.classList.add('notransition')

        const this_touch = e.changedTouches[0][current_swipe.is_landscape ? 'clientX' : 'clientY']
        let delta = this_touch - current_swipe.touch_start
        if (!current_swipe.is_landscape) delta = -delta

        if (!current_swipe.drag_start_threshold_was_passed && Math.abs(delta) < drag_start_threshold) return
        if (!current_swipe.drag_start_threshold_was_passed) {
            current_swipe.drag_start_threshold_was_passed = true
            current_swipe.touch_start = this_touch
            return
        }

        const new_size = within(
            current_swipe.panel_start_size + delta,
            0,
            current_swipe.panel_full_size
        )

        set_size(new_size);
    })
}
