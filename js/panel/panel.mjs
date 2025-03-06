import { make_expandable_on_swipe } from './panel_swipe.mjs'
import {
    set_css_num_var,
    debounce,
    add_disposable_transitionend_handler,
    is_mouse_device,
    is_landscape,
    wait_once_for_transitionend,
    get_panel_current_breadth,
    wait_1frame,
} from '../utils.mjs'
import { init_photoswipe } from './init_photoswipe.mjs'

const EXPAND_TRANSITION_DURATION = 250
const CONTENT_FADE_DURATION = 200
const PANEL_EXPAND_BUTTON_SIZE = 40

set_css_num_var('--panel-expand-transition-duration', EXPAND_TRANSITION_DURATION / 1000, 's')
set_css_num_var('--panel-breadth', 0, 'px')
set_css_num_var('--panel-expand-button-size', PANEL_EXPAND_BUTTON_SIZE, 'px')
set_css_num_var('--panel-content-fade-duration', CONTENT_FADE_DURATION / 1000, 's')

const expand_button_el = document.querySelector(`#panel-expand-button`)
const tappable_margin = document.querySelector(`#panel-expand-tappable-margin`)
const panel_expand_button_el = document.querySelector('#panel-expand-button')

const before_set_content_subscribers = []

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
            set_css_num_var('--panel-breadth', size, 'px')
            const fsize = await this.full_size_promise
            panel.body_element.style.opacity = (size > fsize * 0.2) ? 1 : 0
            tappable_margin.style.display = (size === 0 && !is_mouse_device) ? 'block' : 'none'
            update_expand_button()
        } else {
            // TODO remove console warning
            console.warn('no size passed to panel.set_size')
        }
    },
    async expand() {
        const fsize = await panel.full_size_promise
        panel.set_size(fsize)
        panel.wrapper_element.style.opacity = 1
        panel_expand_button_el.style.opacity = 1
    },
    async toggle() {
        const was_expanded = await panel.is_rather_expanded()
        was_expanded ? panel.set_size(0) : panel.expand()
    },
    async is_rather_expanded() {
        const full_size = await panel.full_size_promise
        return get_panel_current_breadth() > full_size / 2
    },
    content: null,
    async set_content(_content) {
        if (panel.content?.element === _content?.element) {
            console.log('panel already has this content')   
            return
        }
        
        Object.values(before_set_content_subscribers).forEach(s => s(_content))
        
        await fade_out_content_if_present()

        panel.content = _content
        panel.body_element.innerHTML = ''
        panel.body_element.appendChild(_content.element)
        panel.body_element.style.opacity = 0
        
        await wait_1frame()
        
        _content.update_size()
        panel.cache_full_size()
        panel.expand()
        
        panel.body_element.style.opacity = 1

        panel.body_element.scrollTop = 0
        panel.body_element.scrollLeft = 0
        init_photoswipe()
    },

    on_before_set_content(s_name, subscriber) {
        before_set_content_subscribers[s_name] = subscriber
    }
}

const fade_out_content_if_present = async () => {
    if (!panel.content || get_panel_current_breadth() === 0) {
        return Promise.resolve()
    } else {
        panel.body_element.style.opacity = 0
        await wait_once_for_transitionend(panel.body_element)
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