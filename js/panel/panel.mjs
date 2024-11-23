import { make_expandable_on_swipe } from './panel_swipe.mjs'
import { get_css_var_num, set_css_num_var, debounce } from '../utils.mjs'
import { get_panel_intrinsic_size } from './panel_utils.mjs'
import { handle_resize } from './panel_resize.mjs'

const EXPAND_TRANSITION_DURATION = 350

set_css_num_var('--expand-transition-duration', EXPAND_TRANSITION_DURATION / 1000, 's');
set_css_num_var('--panel-size', 0, 'px');

const expand_button_el = document.querySelector(`#panel-expand-button`)
const panel_expander_el = document.querySelector(`#panel-expander`)

const update_expand_button = debounce(async () => {
    const was_expanded = await panel.is_rather_expanded()
    expand_button_el.classList[was_expanded ? 'add' : 'remove']('inward')
})

export const panel = {
    element: panel_expander_el,

    full_size_promise: null,
    cache_full_size() {
        panel.full_size_promise = new Promise(resolve => {
            requestAnimationFrame(() => { // have to wait because content might not be rendered yet
                resolve(get_panel_intrinsic_size())
            })
        })
    },
    set_size(size) {
        if (size !== undefined) {
            set_css_num_var('--panel-size', size, 'px')
            update_expand_button()
            panel.is_rather_expanded().then(was_expanded => {
                const method = was_expanded ? 'add' : 'remove'
                panel.content.element.classList[method]('opaque')
            })
        } else {
            // TODO remove console warning
            console.warn('no size passed to panel.set_size')
        }
    },
    async expand() {
        panel.set_size(await panel.full_size_promise)
    },
    async toggle() {
        const was_expanded = await panel.is_rather_expanded()
        was_expanded ? panel.set_size(0) : panel.expand()
    },
    async is_rather_expanded() {
        const full_size = await panel.full_size_promise
        return get_css_var_num('--panel-size') > full_size / 2
    },
    content: null,
    set_content(_content) {
        panel.content = _content
        panel_expander_el.querySelector('#panel').appendChild(_content.element)
        panel.cache_full_size()
    }
}

handle_resize(panel)

expand_button_el.addEventListener('click', panel.toggle)

make_expandable_on_swipe(panel)