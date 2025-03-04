import { make_expandable_on_swipe } from './panel_swipe.mjs'
import { get_css_var_num, set_css_num_var, debounce, add_disposable_transitionend_handler } from '../utils.mjs'
import { get_panel_intrinsic_size, get_panel_el } from './panel_utils.mjs'
import { init_photoswipe } from './init_photoswipe.mjs';

const EXPAND_TRANSITION_DURATION = 250
const PANEL_EXPAND_BUTTON_SIZE = 40

set_css_num_var('--panel-expand-transition-duration', EXPAND_TRANSITION_DURATION / 1000, 's');
set_css_num_var('--panel-size', 0, 'px');
set_css_num_var('--panel-expand-button-size', PANEL_EXPAND_BUTTON_SIZE, 'px');

const expand_button_el = document.querySelector(`#panel-expand-button`)
const expand_extra_margin = document.querySelector(`#panel-expand-extra-margin`)
const panel_expander_el = document.querySelector(`#panel-expander`)
const panel_expand_button_el = document.querySelector('#panel-expand-button')

const update_expand_button = debounce(async () => {
    const was_expanded = await panel.is_rather_expanded()
    expand_button_el.classList[was_expanded ? 'add' : 'remove']('inward')
})

export const panel = {
    element: panel_expander_el,

    full_size_promise: Promise.resolve(),
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
            this.full_size_promise.then(fsize => {
                get_panel_el().firstElementChild.style.opacity = (size > fsize * 0.2) ? 1 : 0
            })
            update_expand_button()
        } else {
            // TODO remove console warning
            console.warn('no size passed to panel.set_size')
        }
    },
    async expand() {
        panel.set_size(await panel.full_size_promise)
        panel_expander_el.style.opacity = 1
        panel_expand_button_el.style.opacity = 1
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
        get_panel_el().innerHTML = ''
        get_panel_el().appendChild(_content.element)
        panel.cache_full_size()
        panel.element.scrollTop = 0
        panel.element.scrollLeft = 0
        panel.element.firstElementChild.scrollTop = 0
        panel.element.firstElementChild.scrollLeft = 0
        init_photoswipe()
    }
}

expand_button_el.addEventListener('click', panel.toggle)
expand_extra_margin.addEventListener('click', panel.toggle)

make_expandable_on_swipe(panel)

add_disposable_transitionend_handler(
    panel_expander_el,
    () => { panel_expander_el.classList.add('first-animation-complete') }
)

export const PANEL_CONTENT_TYPES = Object.freeze({
    HIGHLIGHTS: 0,
    BUILDING: 1
})