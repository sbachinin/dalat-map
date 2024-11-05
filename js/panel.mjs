/* export const create_element_from_Html = htmlString => {
    if (typeof htmlString !== 'string') {
        console.warn('create_element_from_Html expects an html string, instead got: ', htmlString)
        return document.createElement('div')
    }

    const div = document.createElement('div')
    div.innerHTML = htmlString.trim()
    if (!div.firstElementChild) {
        console.warn(`create_element_from_Html: failed to create an element from string: "${htmlString}"`)
        return document.createElement('div')
    }
    return div.firstElementChild
} */

const el = document.querySelector(`#panel-expander`)

export const panel = {
    element: el,
    expand() {
        el.classList.add('expanded')
    },
    collapse() {
        el.classList.remove('expanded')
    },
}
