import PhotoSwipeLightbox from '../../photoswipe/dist/photoswipe-lightbox.esm.min.js'
import { panel_is_vertical } from '../utils/frontend_utils.mjs'
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
        hideAnimationDuration: PSWP_HIDE_ANIMATION_DURATION,
        maxZoomLevel: 1
    })

    lightbox.init()

    lightbox.on('closingAnimationStart', () => {
        const bldg_links = document.querySelectorAll('.pswp .bldg-link')
        bldg_links.forEach(bldg_link => { bldg_link.style.opacity = 0 })
    })

    lightbox.on('close', () => {
        const slide_i = lightbox.pswp.currIndex

        const thumb_at_i = document.querySelectorAll(`#panel-thumbs-list img`)[slide_i]

        if (!thumb_at_i) {
            console.warn('Bug. No thumb found at an index of last slide. Cancel trying to auto-scroll the thumb list.')
            return
        }

        const rect = thumb_at_i.getBoundingClientRect()
        const vert_in_view = rect.top < window.innerHeight && rect.bottom > 0
        const hor_in_view = rect.left < window.innerWidth && rect.right > 0
        const thumb_is_at_least_partly_visible = vert_in_view && hor_in_view

        if (!thumb_is_at_least_partly_visible) {
            thumb_at_i.scrollIntoView({
                behavior: 'instant',
                block: 'center',
                inline: 'center',
                container: 'nearest'
            })
        }

    })
}
