const toggle_panel = (fn) => {
    panelEl.classList.remove('notransition')
    setTimeout(() => {
        fn()
        panel_expand_button.classList[panel.is_expanded() ? 'add' : 'remove']('inward')
    })
    setTimeout(() => {
        panelEl.classList.add('notransition')
    }, 250)
}

const panelEl = document.querySelector(`#panel-expander`)

export const panel = {
    element: panelEl,
    expand() {
        toggle_panel(() => { panelEl.classList.add('expanded') })
    },
    collapse() {
        toggle_panel(() => { panelEl.classList.remove('expanded') })
    },
    is_expanded() {
        return panelEl.classList.contains('expanded')
    },
    insertContent() {

    }
}

const panel_expand_button = document.querySelector(`#panel-expand-button`)

panel_expand_button.addEventListener('click', () => {
    panel.is_expanded() ? panel.collapse() : panel.expand()
})