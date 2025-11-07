import { make_expandable_on_swipe } from './panel_swipe.mjs'
import {
    set_css_num_var,
    debounce,
    is_mouse_device,
    wait_once_for_transitionend,
    wait_1frame,
    wait,
    get_panel_shown_breadth,
    panel_is_vertical,
    get_root_html_attribute,
} from '../utils/frontend_utils.mjs'
import { init_photoswipe } from './init_photoswipe.mjs'
import { wait_for_sizeless_images_load } from './wait_for_sizeless_images_load.mjs'

const FIRST_EXPAND_TRANSITION_DURATION = 1200
const FIRST_EXPAND_TRANSITION_DELAY = 1500
const EXPAND_TRANSITION_DURATION = 500
const CONTENT_FADE_DURATION = 200


const expand_button_el = document.querySelector(`#panel-expand-button`)
const tappable_margin = document.querySelector(`#panel-expand-tappable-margin`)
const right_button_group_height = document.querySelector('#right-button-group').clientHeight

set_css_num_var('--panel-expand-transition-duration', EXPAND_TRANSITION_DURATION / 1000, 's')
set_css_num_var('--panel-first-expand-transition-duration', FIRST_EXPAND_TRANSITION_DURATION / 1000, 's')
set_css_num_var('--panel-first-expand-transition-delay', FIRST_EXPAND_TRANSITION_DELAY / 1000, 's')
set_css_num_var('--panel-breadth', 0, 'px')
set_css_num_var('--panel-expand-button-size', expand_button_el.offsetWidth, 'px')
set_css_num_var('--panel-content-fade-duration', CONTENT_FADE_DURATION / 1000, 's')

const subscribers = {
    'content was just set': {},
    'begin transition to new size': {}, // to be fired only when panel is toggled, not on drag
    'scroll': {},
    'new content breadth': {},
}

const get_panel_body_breadth = _ => { // height/width with scrollbar
    return panel.body_element[panel_is_vertical() ? 'offsetWidth' : 'offsetHeight']
}

export const update_panel_expand_button = debounce(() => {
    const will_be_expanded = panel.must_expand || panel.is_at_least_partially_expanded()
    expand_button_el.classList[will_be_expanded ? 'add' : 'remove']('inward')
    panel.expand_button_el.classList.remove('hidden') // to avoid visual noise, show button only after the direction of the arrow is defined
})

export const panel = {
    wrapper_element: document.querySelector(`#panel-expander`),
    body_element: document.querySelector(`#panel`),
    expand_button_el,

    content_breadth: null,
    cache_content_breadth() {
        panel.content_breadth = get_panel_body_breadth()
    },
    async set_size(size) {
        if (size === undefined) return

        // ###8 about "pristine" and slow first expand
        if (panel.was_never_expanded()) {
            panel.wrapper_element.classList.add('pristine')
            setTimeout(() => {
                panel.wrapper_element.classList.remove('pristine')
            }, FIRST_EXPAND_TRANSITION_DELAY + FIRST_EXPAND_TRANSITION_DURATION)
        }

        set_css_num_var('--panel-breadth', size, 'px')

        let right_button_group_offset = 0
        if (window.matchMedia("(orientation: portrait)").matches) {
            const thresh = (window.innerHeight - right_button_group_height) / 2 // at which point panel starts pushing the buttons
            right_button_group_offset = Math.max(0, size - thresh)
            set_css_num_var('--right-buttons-vert-offset', right_button_group_offset, 'px')
        }

        // "panel_was_expanded" means "at least partially expanded"
        localStorage.setItem('panel_was_expanded', size > 0)
        document.documentElement.setAttribute('panel-is-expanded', size > 0)

        if (!get_root_html_attribute('panel-is-dragged')
            && (size === 0 || size === panel.content_breadth)
        ) {
            panel.fire('begin transition to new size', size, panel.content_breadth)
        }

        panel.body_element.style.opacity = (size > panel.content_breadth * 0.2) ? 1 : 0
        tappable_margin.style.display = (size === 0 && !is_mouse_device) ? 'block' : 'none'
        update_panel_expand_button()
    },

    is_pristine() {
        return panel.wrapper_element.classList.contains('pristine')
    },

    /* 
        This can mean 2 things really:
        1) expand to content from 0
        2) resize from the previous content size to new content size, if panel was already expanded
            (therefore it can obtain a smaller size, thus calling this "expand to content" would be slightly wrong).
        I'm not sure if this function is clear enough in its purpose.
            Possibly, "expand" and "resize_the_already_expanded_panel_to_different_content" should be 2 different things, IDK
    */
    async resize_to_content() {
        panel.set_size(panel.content_breadth)

        await wait(EXPAND_TRANSITION_DURATION)
        panel.must_expand = false
    },
    toggle() {
        if (panel.is_pristine()) return

        const was_expanded = panel.is_at_least_partially_expanded()

        if (was_expanded) {
            panel.set_size(0)
        } else if (panel.content) {
            panel.resize_to_content()
        } else {
            console.error(`content is missing, this can't be right`)
        }
    },
    UNUSED_is_rather_collapsed() {
        return get_panel_shown_breadth() <= panel.content_breadth / 2
    },

    is_at_least_partially_expanded() {
        return localStorage.getItem('panel_was_expanded') === 'true'
    },

    must_expand: false,

    was_never_expanded: () => localStorage.getItem('panel_was_expanded') === null,

    /*
        {
            id: 'higlights' | number(bldg id),
            element: HTMLElement,
            update_size: () => void    // function that adjusts the CSS styles of the content, and after it's done, the content's actual size can be measured to decide how much the panel should be expanded
        }
    */
    content: null,

    async set_content(
        _content,
        { postpone_panel_expand = false } = {} // may need to expand only after a flight to a building has finished
    ) {
        if (!_content.id) {
            throw new Error('panel content has to have id')
        }
        if (panel.content?.id === _content?.id) {
            panel.resize_to_content()
            return
        }

        await Promise.all([
            fade_out_content_if_present(),
            // wait for "other images", not lazy thumbs!
            wait_for_sizeless_images_load(_content.element.querySelectorAll('img:not(#panel-thumbs-list img)'))
        ])

        _content.update_size = _content.update_size || (() => { })
        panel.content = _content
        panel.body_element.innerHTML = ''
        panel.body_element.appendChild(_content.element)
        panel.body_element.style.opacity = 0
        document.documentElement.setAttribute('panel-content-id', _content.id)

        await wait_1frame()


        _content.update_size()
        panel.cache_content_breadth()

        panel.fire('new content breadth')

        /*
            If panel is already expanded, resize to a new breadth immediately
                (waiting for a flight to end looks awkward in this case).
            If panel is being expanded from 0,
                delay it if necessary (if a flight is about to begin, and thus expanding the panel now will cause too much action on the screen)
        */
        if (
            panel.is_at_least_partially_expanded()
            || (panel.must_expand && !postpone_panel_expand)
        ) {
            panel.resize_to_content()
        }

        panel.body_element.scrollTop = 0
        panel.body_element.scrollLeft = 0
        panel.body_element.style.opacity = 1

        init_photoswipe()

        panel.fire('content was just set', _content)
    },

    // calling this with same subscriber_name again removes the old subscriber
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
    if (!panel.content || get_panel_shown_breadth() === 0) {
        return Promise.resolve()
    } else {
        panel.body_element.style.opacity = 0
        await wait_once_for_transitionend(panel.body_element)
    }
}

panel.body_element.addEventListener('scroll', e => panel.fire('scroll', e))

expand_button_el.addEventListener('click', panel.toggle)
tappable_margin.addEventListener('click', panel.toggle)

make_expandable_on_swipe(panel)

export const PANEL_CONTENT_TYPES = Object.freeze({
    HIGHLIGHTS: 0,
    BUILDING: 1
})