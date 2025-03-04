import PhotoSwipeLightbox from '../../photoswipe/dist/photoswipe-lightbox.esm.min.js'
import { is_landscape } from '../utils.mjs'
import { panel } from './panel.mjs'

export let lightbox = null

export const PSWP_HIDE_ANIMATION_DURATION = 333

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
        counter: false,
        hideAnimationDuration: PSWP_HIDE_ANIMATION_DURATION
    })

    lightbox.init()

    lightbox.on('closingAnimationStart', () => {
        const bldg_links = document.querySelectorAll('.pswp .bldg-link')
        bldg_links.forEach(bldg_link => { bldg_link.style.opacity = 0 })
    })

    lightbox.on('close', () => {
        const slide_i = lightbox.pswp.currIndex

        const panel_el = panel.body_element
        const thumb_i = document.querySelectorAll(`#panel-thumbs-list > *`)[slide_i]

        if (!thumb_i) {
            console.warn('Bug. No thumb found at an index of last slide. Cancel trying to auto-scroll the thumb list.')
            return
        }

        let top = undefined
        let left = undefined
        if (is_landscape()) {
            top = thumb_i.offsetTop - (panel_el.offsetHeight - thumb_i.offsetHeight) / 2
        } else {
            left = thumb_i.offsetLeft - (panel_el.offsetWidth - thumb_i.offsetWidth) / 2
        }

        panel_el.scrollTo({ top, left, behavior: 'auto' })
    })
}
