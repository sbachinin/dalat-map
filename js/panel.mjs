import { make_expandable_on_swipe } from './panel_swipe.mjs'
import {
    get_css_var_num,
    set_css_num_var,
    get_panel_el,
    get_panel_intrinsic_size,
    debounce
} from './utils.mjs'

const EXPAND_TRANSITION_DURATION = 350
const SCROLLBAR_WIDTH = 7

set_css_num_var('--expand-transition-duration', EXPAND_TRANSITION_DURATION / 1000, 's');
set_css_num_var('--panel-size', 0, 'px');

const expand_button_el = document.querySelector(`#panel-expand-button`)
const panel_expander_el = document.querySelector(`#panel-expander`)
const panel_el = get_panel_el()

let content = null

const update_expand_button = debounce(() => {
    expand_button_el.classList[panel.is_expanded() ? 'add' : 'remove']('inward')
})

export const panel = {
    element: panel_expander_el,
    set_full_size(size) { // TODO must be async
        size = size ?? get_panel_intrinsic_size()
        set_css_num_var('--panel-full-size', size, 'px')
        return size
    },
    set_size(size) {
        if (size !== undefined) {
            set_css_num_var('--panel-size', size, 'px')
            update_expand_button()
        } else {
            // TODO remove console warning
            console.warn('no size passed to panel.set_size')
        }
    },
    expand() {
        // TODO has to wait for full size to take shape
        let full_size = get_css_var_num('--panel-full-size')
        if (isNaN(full_size)) {
            console.warn('there was no full size set on a panel yet')
            full_size = panel.set_full_size()
        }
        panel.set_size(full_size)
    },
    toggle() {
        panel.is_expanded() ? panel.set_size(0) : panel.expand()
    },
    is_expanded() {
        return get_css_var_num('--panel-size') > get_css_var_num('--panel-full-size') / 2
    },
    set_content(_content) {
        content = _content
        panel_expander_el.querySelector('#panel').appendChild(_content.element)
        setTimeout(panel.set_full_size, 1)
    }
}

const handle_resize = () => {
    content.update()
    panel_el.scrollTop = 0
    panel_el.scrollLeft = 0
    const was_expanded = panel.is_expanded()
    setTimeout(() => {  // after content has surely resized...
        const full_size = panel.set_full_size()
        // can just always collapse panel after resize, if it simplifies:
        panel.set_size(was_expanded ? full_size : 0)
    }, 1)
}

window.addEventListener('resize', handle_resize)
window.addEventListener('orientationchange', handle_resize)

expand_button_el.addEventListener('click', panel.toggle)

make_expandable_on_swipe(panel.set_size)