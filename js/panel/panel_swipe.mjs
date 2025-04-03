import {
    is_landscape,
    within,
    get_panel_shown_breadth
} from '../utils/utils.mjs'

const fast_swipe_toggle_threshold = 25
const fast_swipe_max_duration = 250
const drag_start_threshold = 10

let current_swipe = null


const handle_touch_events = (
    on_touchstart,
    on_touchmove,
    on_touchend
) => {
    document.addEventListener(
        'touchstart',
        on_touchstart
    )
    document.addEventListener(
        'touchmove',
        on_touchmove,
        { passive: false }
    )
    document.addEventListener(
        'touchend',
        on_touchend
    )
}

const get_coord_on_drag_axis = xy => {
    return xy[current_swipe.drag_axis === 'x' ? 'clientX' : 'clientY']
}

const get_delta_on_drag_axis = (current_XY, start_coord) => {
    const prop = current_swipe.drag_axis === 'x' ? 'clientX' : 'clientY'
    return current_XY[prop] - start_coord
}

const get_delta_on_scroll_axis = (current_XY, current_swipe) => {
    const prop = current_swipe.drag_axis === 'x' ? 'clientY' : 'clientX'
    return current_XY[prop] - current_swipe.touch_start_XY[prop]
}

const orthogonal_swipe_is_greater_or_equal = current_XY => {
    const scroll_delta = get_delta_on_scroll_axis(current_XY, current_swipe)
    const drag_delta = get_delta_on_drag_axis(
        current_XY,
        get_coord_on_drag_axis(current_swipe.touch_start_XY)
    )
    return Math.abs(scroll_delta) >= Math.abs(drag_delta)
}

export const make_expandable_on_swipe = (panel) => {
    if (window.matchMedia("(pointer: fine)").matches) return

    panel.body_element.addEventListener('scroll', _ => {
        if (current_swipe) {
            current_swipe.content_was_scrolled = true
        }
    })

    const on_touchstart = (e) => {
        if (e.target.closest('#building-info__subtitle')) return

        if (panel.is_pristine()) return

        if (
            e.target.closest('#' + panel.body_element.id)
            || e.target.closest('#panel-expand-button')
            || e.target.closest('#panel-expand-tappable-margin')
        ) {
            if (e.touches.length > 1) {
                e.preventDefault()
                return
            }

            current_swipe = {
                panel_start_size: get_panel_shown_breadth(),
                panel_full_size: panel.content_breadth,
                touch_start_XY: e.changedTouches[0],
                drag_start_coord: null,
                drag_axis: is_landscape() ? 'x' : 'y',
                content_was_scrolled: false,
                had_touchmove: false,
                touch_start_timestamp: Date.now()
            }
        }
    }

    const try_start_dragging = (e) => {
        if (current_swipe.drag_start_coord !== null) return true

        let delta = get_delta_on_drag_axis(
            e.changedTouches[0],
            get_coord_on_drag_axis(current_swipe.touch_start_XY)
        )

        if (Math.abs(delta) < drag_start_threshold) return false

        // here: thresh was passed in some dir
        // but there is a possibility that scroll has begun so recently that "content_was_scrolled" flag isnt' set yet
        // so i ask if swipe in scroll direction was greater:
        if (orthogonal_swipe_is_greater_or_equal(e.changedTouches[0])) return false

        current_swipe.drag_start_coord = get_coord_on_drag_axis(current_swipe.touch_start_XY)
            + drag_start_threshold * Math.sign(delta)
        return true
    }

    const on_touchmove = (e) => {
        if (
            e.target.closest('#panel-expand-button') // prevents "navigate back" action
            || (e.target.closest('#' + panel.body_element.id) && e.touches.length > 1) // prevents pinch-related mess
        ) {
            e.preventDefault()
        }

        if (!current_swipe) return

        if (current_swipe.content_was_scrolled
            // Drag & scroll can start together (it's difficult to solve it).
            // This condition allows them to happen in parallel, rather than stopping the drag which is uglier
            && !current_swipe.drag_start_coord
        ) return

        current_swipe.had_touchmove = true

        panel.wrapper_element.classList.add('notransition')

        const drag_has_begun = try_start_dragging(e)
        if (!drag_has_begun) return

        let delta = get_coord_on_drag_axis(e.changedTouches[0]) - current_swipe.drag_start_coord
        if (current_swipe.drag_axis === 'y') delta = -delta

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


    const on_touchend = e => {
        requestAnimationFrame(() => { current_swipe = null })

        panel.wrapper_element.classList.remove('notransition')

        if (!current_swipe) return
        if (!current_swipe.had_touchmove) return
        if (current_swipe.content_was_scrolled && !current_swipe.drag_start_coord) return

        const current_size = get_panel_shown_breadth()
        if (current_size === current_swipe.panel_start_size) return // TODO maybe this can be safely removed now

        // if swipe was tiny, try to return to original state:
        let should_expand = current_size > (current_swipe.panel_full_size / 2)

        // if swipe was long, change the state:
        let end_delta = get_delta_on_drag_axis(e.changedTouches[0], current_swipe.drag_start_coord)
        if (current_swipe.drag_axis === 'y') end_delta = -end_delta

        const swipe_was_fast = (Date.now() - current_swipe.touch_start_timestamp) < fast_swipe_max_duration

        const actual_threshold = swipe_was_fast
            ? fast_swipe_toggle_threshold
            : (current_swipe.panel_full_size / 2)
        const has_swiped_far = Math.abs(end_delta) > actual_threshold

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
