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

const handle_touch_events = (
    on_touchstart,
    on_touchmove,
    on_touchend
) => {
    const get_this_coord = e => e.changedTouches[0][is_landscape() ? 'clientX' : 'clientY']
    document.addEventListener(
        'touchstart',
        e => on_touchstart(e, get_this_coord(e))
    )
    document.addEventListener(
        'touchmove',
        e => on_touchmove(e, get_this_coord(e)),
        { passive: false }
    )
    document.addEventListener(
        'touchend',
        e => on_touchend(e, get_this_coord(e))
    )
}

export const make_expandable_on_swipe = (panel) => {
    const on_touchstart = async (e, this_coord) => {
        if (
            e.target.closest('#' + get_panel_el().id)
            || e.target.closest('#panel-expand-button')
        ) {
            const panel_full_size = await panel.full_size_promise

            current_swipe = {
                panel_start_size: get_css_var_num('--panel-size'),
                panel_full_size,
                touch_start: this_coord,
                drag_start: null,
                // this was unused:
                // initial_scroll_pos: get_panel_el()[is_landscape() ? 'scrollTop' : 'scrollLeft'],
                is_landscape: is_landscape(),
                content_was_scrolled: false,
                had_touchmove: false
            }
        }
    }

    const try_start_dragging = (this_touch) => {
        if (current_swipe.drag_start !== null) return true

        let delta = this_touch - current_swipe.touch_start
        if (Math.abs(delta) < drag_start_threshold) return false

        // here: thresh was passed in some dir

        current_swipe.drag_start = current_swipe.touch_start + drag_start_threshold * Math.sign(delta)
        return true
    }

    const on_touchmove = (e, this_touch) => {
        e.target.closest('#panel-expand-button') && e.preventDefault()

        if (!current_swipe || current_swipe.content_was_scrolled) return

        current_swipe.had_touchmove = true

        get_panel_el().parentElement.classList.add('notransition')

        const drag_has_begun = try_start_dragging(this_touch)
        if (!drag_has_begun) return

        let delta = this_touch - current_swipe.drag_start
        if (!current_swipe.is_landscape) delta = -delta

        // panel dragging has surely begun
        // so the default touch behaviours, especially pull-refresh, and scroll too, must be blocked
        e.preventDefault()

        const new_size = within(
            current_swipe.panel_start_size + delta,
            0,
            current_swipe.panel_full_size
        )

        panel.set_size(new_size);
    }


    const on_touchend = (_, touch_end) => {
        get_panel_el().parentElement.classList.remove('notransition')

        requestAnimationFrame(() => { current_swipe = null })

        if (
            !current_swipe
            || !current_swipe.had_touchmove
            || current_swipe.content_was_scrolled
        ) return

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

        panel.set_size(should_expand ? current_swipe.panel_full_size : 0)
    }


    handle_touch_events(
        on_touchstart,
        on_touchmove,
        on_touchend
    )
}
