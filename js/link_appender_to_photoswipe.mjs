import { panel, PANEL_CONTENT_TYPES } from "./panel/panel.mjs"
import { create_element_from_Html, debounce, is_mouse_device, observe_dom_mutations } from "./utils.mjs"

const bldg_svg = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
<path fill="#E8EAF6" d="M42 39L6 39 6 23 24 6 42 23z"></path><path fill="#C5CAE9" d="M39 21L34 16 34 9 39 9zM6 39H42V44H6z"></path><path fill="#B71C1C" d="M24 4.3L4 22.9 6 25.1 24 8.4 42 25.1 44 22.9z"></path><path fill="#D84315" d="M18 28H30V44H18z"></path><path fill="#01579B" d="M21 17H27V23H21z"></path><path fill="#FF8A65" d="M27.5,35.5c-0.3,0-0.5,0.2-0.5,0.5v2c0,0.3,0.2,0.5,0.5,0.5S28,38.3,28,38v-2C28,35.7,27.8,35.5,27.5,35.5z"></path>
</svg>`

export const bldg_link_html = `<div class="bldg-link">${bldg_svg}</div>`

observe_dom_mutations('body', mutations => {
    if (panel.content?.type !== PANEL_CONTENT_TYPES.HIGHLIGHTS) return

    const all_added_nodes = mutations.flatMap(m => [...m.addedNodes])

    all_added_nodes.forEach(added_node => {

        if (added_node.classList?.contains('pswp') && is_mouse_device()) {
            // By default photoswipe opens desktop slider abruptly,this fixes it
            added_node.style.opacity = 1
        }

        if (added_node instanceof HTMLElement
            && !added_node.closest('.bldg-link')
            && added_node.closest('.pswp')
        ) {
            // here: .pswp or a child of .pswp (but not a .bldg_link) was added to the document
            append_all_bldg_links()
        }
    })
})

// On any mutations in (and within) .pswp, append .bldg-link to each .pswp__item
const append_all_bldg_links = debounce(() => {
    document.querySelectorAll('.pswp .pswp__item')
        .forEach(pi => {
            const bldg_img = pi.querySelector('img.pswp__img')
            if (!bldg_img) return

            const old_link = pi.querySelector('.bldg-link')
            const bldg_link = old_link || create_element_from_Html(bldg_link_html)
            bldg_link.setAttribute('img-src', bldg_img.src)
            !old_link && pi.appendChild(bldg_link)

            setTimeout(() => { bldg_link.style.opacity = 1 }, 50) // shows up without transition if no timeout or 0 timeout, don't know why        
        })
}, 50)