import { make_expandable_on_swipe } from './panel_swipe.mjs'
import {
    get_css_var_num,
    set_css_num_var,
    debounce,
    add_disposable_transitionend_handler,
    is_mouse_device,
    is_landscape,
} from '../utils.mjs'
import { init_photoswipe } from './init_photoswipe.mjs';

const EXPAND_TRANSITION_DURATION = 250
const PANEL_EXPAND_BUTTON_SIZE = 40

set_css_num_var('--panel-expand-transition-duration', EXPAND_TRANSITION_DURATION / 1000, 's');
set_css_num_var('--panel-size', 0, 'px');
set_css_num_var('--panel-expand-button-size', PANEL_EXPAND_BUTTON_SIZE, 'px');

const expand_button_el = document.querySelector(`#panel-expand-button`)
const tappable_margin = document.querySelector(`#panel-expand-tappable-margin`)
const panel_expand_button_el = document.querySelector('#panel-expand-button')

const get_panel_intrinsic_size = _ => { // height/width with scrollbar
    return panel.body_element[is_landscape() ? 'offsetWidth' : 'offsetHeight']
}

const update_expand_button = debounce(async () => {
    const was_expanded = await panel.is_rather_expanded()
    expand_button_el.classList[was_expanded ? 'add' : 'remove']('inward')
})

export const panel = {
    wrapper_element: document.querySelector(`#panel-expander`),
    body_element: document.querySelector(`#panel`),

    full_size_promise: Promise.resolve(),
    cache_full_size() {
        panel.full_size_promise = new Promise(resolve => {
            requestAnimationFrame(() => { // have to wait because content might not be rendered yet
                resolve(get_panel_intrinsic_size())
            })
        })
    },
    async set_size(size) {
        if (size !== undefined) {
            set_css_num_var('--panel-size', size, 'px')
            const fsize = await this.full_size_promise
            panel.content.element.style.opacity = (size > fsize * 0.2) ? 1 : 0
            tappable_margin.style.display = (size === 0 && !is_mouse_device) ? 'block' : 'none'
            update_expand_button()
        } else {
            // TODO remove console warning
            console.warn('no size passed to panel.set_size')
        }
    },
    async expand() {
        panel.set_size(await panel.full_size_promise)
        panel.wrapper_element.style.opacity = 1
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
        if (panel.content === _content) return
        

        panel.content = _content
        panel.body_element.innerHTML = ''
        panel.body_element.appendChild(_content.element)
        panel.cache_full_size()
        panel.wrapper_element.scrollTop = 0
        panel.wrapper_element.scrollLeft = 0
        panel.wrapper_element.firstElementChild.scrollTop = 0
        panel.wrapper_element.firstElementChild.scrollLeft = 0
        init_photoswipe()
    }
}

expand_button_el.addEventListener('click', panel.toggle)
tappable_margin.addEventListener('click', panel.toggle)

make_expandable_on_swipe(panel)

add_disposable_transitionend_handler(
    panel.wrapper_element,
    () => { panel.wrapper_element.classList.add('first-animation-complete') }
)

export const PANEL_CONTENT_TYPES = Object.freeze({
    HIGHLIGHTS: 0,
    BUILDING: 1
})