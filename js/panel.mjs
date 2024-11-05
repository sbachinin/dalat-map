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
    insertContent() {

    }
}

document.addEventListener('click', function (event) {
    if (!panelEl.contains(event.target)) {
        panel.collapse()
    }
});
