import { try_open_building } from "./bldg_details.mjs"
import { lightbox } from "./panel/init_photoswipe.mjs"
import { panel, PANEL_CONTENT_TYPES } from "./panel/panel.mjs"
import { create_element_from_Html, find_bldg_id_by_image_filename, is_mouse_device, observe_dom_mutations } from "./utils.mjs"

const bldg_svg = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
<path fill="#E8EAF6" d="M42 39L6 39 6 23 24 6 42 23z"></path><path fill="#C5CAE9" d="M39 21L34 16 34 9 39 9zM6 39H42V44H6z"></path><path fill="#B71C1C" d="M24 4.3L4 22.9 6 25.1 24 8.4 42 25.1 44 22.9z"></path><path fill="#D84315" d="M18 28H30V44H18z"></path><path fill="#01579B" d="M21 17H27V23H21z"></path><path fill="#FF8A65" d="M27.5,35.5c-0.3,0-0.5,0.2-0.5,0.5v2c0,0.3,0.2,0.5,0.5,0.5S28,38.3,28,38v-2C28,35.7,27.8,35.5,27.5,35.5z"></path>
</svg>`

// 1. On any mutations in (and within) .pswp, append .bldg-link to each .pswp__item

observe_dom_mutations('body', mutations => {
    if (panel.content?.type !== PANEL_CONTENT_TYPES.HIGHLIGHTS) return

    const all_added_nodes = mutations.flatMap(m => [...m.addedNodes])

    all_added_nodes.forEach(added_node => {

        // TODO: this is unrelated to bldg_links, perhaps should rename this file to just "photoswipe observer"
        if (added_node.classList?.contains('pswp') && is_mouse_device()) {
            // Be default photoswipe opens desktop slider abruptly,this fixes it
            added_node.style.opacity = 1
        }

        if (added_node instanceof HTMLElement && added_node.closest('.pswp')) {
            document.querySelectorAll('.pswp .pswp__item')
                .forEach(pi => {
                    if (pi.querySelector('.bldg-link')) return
                    const bldg_link = create_element_from_Html(`<a class="bldg-link">${bldg_svg}</a>`)
                    pi.appendChild(bldg_link)
                    setTimeout(() => { bldg_link.style.opacity = 1 }, 50) // shows up without transition if no timeout or 0 timeout, don't know why        
                })
        }
    })
})

// 2. On click on any .bldg-link, go to a building corresponding to the image name

document.body.addEventListener('click', e => {
    if (e.target.closest('.bldg-link')) {
        const img_src = e.target.closest('.pswp__item')
            .querySelector('.pswp__img:not(.pswp__img--placeholder)')
            ?.src
        if (!img_src) {
            console.warn(`handling click on .bldg-link, img_src is not defined, it's not normal`)
            return
        }
        const img_name = img_src.split('/').pop()
        const bldg_id = find_bldg_id_by_image_filename(decodeURIComponent(img_name))
        console.log(bldg_id)
        try_open_building(bldg_id, true, true)
        lightbox.pswp.close()
    }


})
