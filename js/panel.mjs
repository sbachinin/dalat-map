const do_with_transition = (fn) => {
    panelEl.classList.remove('notransition')
    setTimeout(fn)
    setTimeout(() => {
        panelEl.classList.add('notransition')
    }, 250)
}

const panelEl = document.querySelector(`#panel-expander`)

export const panel = {
    element: panelEl,
    expand() {
        do_with_transition(() => { panelEl.classList.add('expanded') })
    },
    collapse() {
        do_with_transition(() => { panelEl.classList.remove('expanded') })
    },
    is_expanded() {
        return panelEl.classList.contains('expanded')
    },
    insertContent() {

    }
}

const panel_expand_button = document.querySelector(`#panel-expand-button`)

document.addEventListener('click', function (event) {
    if (!panelEl.contains(event.target) && !panel_expand_button.contains(event.target)) {
        panel.collapse()
    }
});


panel_expand_button.addEventListener('click', () => {
    panel.is_expanded() ? panel.collapse() : panel.expand()
})