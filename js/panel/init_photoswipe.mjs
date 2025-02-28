import PhotoSwipeLightbox from '../../photoswipe/dist/photoswipe-lightbox.esm.min.js';
import { is_landscape } from '../utils.mjs';
import { get_panel_el } from './panel_utils.mjs';

export let lightbox = null
export const init_photoswipe = () => {
    if (lightbox) {
        lightbox.init()
        return
    }

    lightbox = new PhotoSwipeLightbox({
        gallery: '#panel-thumbs-list',
        children: 'a',
        pswpModule: () => import('../../photoswipe/dist/photoswipe.esm.min.js'),
        wheelToZoom: true,
        zoom: false,
        counter: false
    })

    lightbox.init()

    lightbox.on('closingAnimationStart', () => {
        const bldg_links = document.querySelectorAll('.pswp .bldg-link')
        bldg_links.forEach(bldg_link => { bldg_link.style.opacity = 0 })
    })

    lightbox.on('close', () => {
        const slide_i = lightbox.pswp.currIndex

        const panel = get_panel_el()
        const thumb_i = document.querySelectorAll(`#panel-thumbs-list > *`)[slide_i]

        let top = undefined
        let left = undefined
        if (is_landscape()) {
            top = thumb_i.offsetTop - (panel.offsetHeight - thumb_i.offsetHeight) / 2
        } else {
            left = thumb_i.offsetLeft - (panel.offsetWidth - thumb_i.offsetWidth) / 2
        }

        panel.scrollTo({ top, left, behavior: 'auto' })
    })
}
