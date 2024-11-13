const SCROLLBAR_WIDTH = 7
const EXPAND_TRANSITION_DURATION = 350

document.documentElement.style.setProperty('--expand-transition-duration', EXPAND_TRANSITION_DURATION / 1000 + 's');

const toggle_panel = (fn) => {
    panel_expander_el.classList.remove('notransition')
    setTimeout(() => {
        fn()
        panel_expand_button.classList[panel.is_expanded() ? 'add' : 'remove']('inward')
    })
    setTimeout(() => {
        panel_expander_el.classList.add('notransition')
    }, EXPAND_TRANSITION_DURATION + 50)
}

const panel_expander_el = document.querySelector(`#panel-expander`)
const panel_el = document.querySelector(`#panel`)

const set_size_variables = () => {
    const is_landscape = window.innerWidth > window.innerHeight
    if (is_landscape) {
        document.documentElement.style.setProperty('--panel-width', panel_el.offsetWidth + 'px');
    } else {
        document.documentElement.style.setProperty('--panel-height', panel_el.offsetHeight + 'px');
    }
}

let content = null

export const panel = {
    element: panel_expander_el,
    expand() {
        toggle_panel(() => {
            set_size_variables()
            panel_expander_el.classList.add('expanded')
        })
    },
    collapse() {
        toggle_panel(() => { panel_expander_el.classList.remove('expanded') })
    },
    is_expanded() {
        return panel_expander_el.classList.contains('expanded')
    },
    set_content(_content) {
        content = _content
        panel_expander_el.querySelector('#panel').appendChild(_content.element)
    }
}

const handle_resize = () => {
    content.update()
    panel_el.scrollTop = 0
    panel_el.scrollLeft = 0
    setTimeout(set_size_variables, 1) // after content has surely resized...
}

window.addEventListener('resize', handle_resize)
window.addEventListener('orientationchange', handle_resize)

const panel_expand_button = document.querySelector(`#panel-expand-button`)
panel_expand_button.addEventListener('click', () => {
    panel.is_expanded() ? panel.collapse() : panel.expand()
})
