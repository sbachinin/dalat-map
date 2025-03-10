import { make_expandable_on_swipe } from './panel_swipe.mjs'
import {
    set_css_num_var,
    debounce,
    is_mouse_device,
    is_landscape,
    wait_once_for_transitionend,
    get_panel_current_breadth,
    wait_1frame,
} from '../utils.mjs'
import { init_photoswipe } from './init_photoswipe.mjs'

const FIRST_EXPAND_TRANSITION_DURATION = 1000
const FIRST_EXPAND_TRANSITION_DELAY = 500
const EXPAND_TRANSITION_DURATION = 300
const CONTENT_FADE_DURATION = 200
const PANEL_EXPAND_BUTTON_SIZE = 40

set_css_num_var('--panel-expand-transition-duration', EXPAND_TRANSITION_DURATION / 1000, 's')
set_css_num_var('--panel-first-expand-transition-duration', FIRST_EXPAND_TRANSITION_DURATION / 1000, 's')
set_css_num_var('--panel-first-expand-transition-delay', FIRST_EXPAND_TRANSITION_DELAY / 1000, 's')
set_css_num_var('--panel-breadth', 0, 'px')
set_css_num_var('--panel-expand-button-size', PANEL_EXPAND_BUTTON_SIZE, 'px')
set_css_num_var('--panel-content-fade-duration', CONTENT_FADE_DURATION / 1000, 's')

const expand_button_el = document.querySelector(`#panel-expand-button`)
const tappable_margin = document.querySelector(`#panel-expand-tappable-margin`)
const panel_expand_button_el = document.querySelector('#panel-expand-button')

const subscribers = {
    'content will be set': {},
    'new breadth was set': {}, // to be fired only when panel is toggled, not on drag
}

const get_panel_body_breadth = _ => { // height/width with scrollbar
    return panel.body_element[is_landscape() ? 'offsetWidth' : 'offsetHeight']
}

const update_expand_button = debounce(async () => {
    const was_expanded = await panel.is_rather_expanded()
    expand_button_el.classList[was_expanded ? 'add' : 'remove']('inward')
})

export const panel = {
    wrapper_element: document.querySelector(`#panel-expander`),
    body_element: document.querySelector(`#panel`),

    /* 
        This is made to force 1-frame delay before getting full size.
        Because if new content was just appended, its width & height might not be calculated yet.
        It's kinda useful but causes extra delay, 10s of ms, and it grows when full size is retreived many times.
        (TODO: possible performance improvement)
     */
    full_size_promise: Promise.resolve(),
    cache_full_size() {
        panel.full_size_promise = new Promise(resolve => {
            requestAnimationFrame(() => { // have to wait because content might not be rendered yet
                resolve(get_panel_body_breadth())
            })
        })
    },
    async set_size(size) {
        if (size === undefined) return

        const fsize = await this.full_size_promise
        set_css_num_var('--panel-breadth', size, 'px')
        if (size === 0 || size === fsize) {
            panel.fire('new breadth was set', size, fsize)
        }

        panel.body_element.style.opacity = (size > fsize * 0.2) ? 1 : 0
        tappable_margin.style.display = (size === 0 && !is_mouse_device) ? 'block' : 'none'
        update_expand_button()
    },
    async resize_to_content() {
        if (panel.wrapper_element.classList.contains('slow-animation')) {
            setTimeout(() => { // used transitionend here but it didn't work on iphone, 1st expand was quick
                panel.wrapper_element.classList.remove('slow-animation')
            }, FIRST_EXPAND_TRANSITION_DURATION + FIRST_EXPAND_TRANSITION_DELAY)
        }
        const fsize = await panel.full_size_promise
        panel.set_size(fsize)
        panel.wrapper_element.style.opacity = 1
        panel_expand_button_el.style.opacity = 1
    },
    async toggle() {
        const was_expanded = await panel.is_rather_expanded()
        was_expanded ? panel.set_size(0) : panel.resize_to_content()
    },
    async is_rather_expanded() {
        const full_size = await panel.full_size_promise
        return get_panel_current_breadth() > full_size / 2
    },
    content: null,
    async set_content(_content) {
        if (panel.content?.element === _content?.element) {
            panel.resize_to_content()
            return
        }

        panel.fire('content will be set', _content)

        await fade_out_content_if_present()

        panel.content = _content
        panel.body_element.innerHTML = ''
        panel.body_element.appendChild(_content.element)
        panel.body_element.style.opacity = 0

        await wait_1frame()


        _content.update_size()
        panel.cache_full_size()

        panel.resize_to_content()

        panel.body_element.style.opacity = 1

        panel.body_element.scrollTop = 0
        panel.body_element.scrollLeft = 0
        init_photoswipe()
    },

    on(event_name, subscriber_name, subscriber, is_one_off = false) {
        if (subscribers[event_name]) {
            subscribers[event_name][subscriber_name] = { cb: subscriber, is_one_off }
        } else {
            console.warn(`no such panel event: ${event_name}`)
        }
    },

    once(event_name, subscriber_name, subscriber) {
        panel.on(event_name, subscriber_name, subscriber, true)
    },

    fire(event_name, ...args) {
        if (subscribers[event_name]) {
            Object.entries(subscribers[event_name]).forEach(([sub_name, sub]) => {
                sub.cb(...args)
                if (sub.is_one_off) delete subscribers[event_name][sub_name]
            })
        } else {
            console.warn(`no such panel event: ${event_name}`)
        }
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

export const PANEL_CONTENT_TYPES = Object.freeze({
    HIGHLIGHTS: 0,
    BUILDING: 1
})