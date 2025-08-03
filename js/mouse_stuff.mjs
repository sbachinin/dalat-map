import { panel } from './panel/panel.mjs'
import { display_highlights } from './highlights.mjs'
import { try_open_building } from './panel/bldg_details.mjs'
import { CURSOR_POINTER_MINZOOM } from './common_drawing_layers/constants.mjs'
import {
    debounce, find_bldg_id_by_image_filename, is_mouse_device
} from './utils/frontend_utils.mjs'
import { lightbox, PSWP_HIDE_ANIMATION_DURATION } from './panel/init_photoswipe.mjs'
import { initialize_custom_zoom_buttons } from './custom_zoom_buttons.mjs'
import { is_feature_selectable } from './utils/does_feature_have_details.mjs'
import { show_tooltip } from './tooltip.mjs'
import { find_clickable_feat } from './find_clickable_feat.mjs'



export const add_mouse_stuff = () => {
    const map = window.dalatmap

    map.on('click', (e) => {
        navigator?.clipboard?.writeText?.(
            `[${e.lngLat.lng.toFixed(6)}, ${e.lngLat.lat.toFixed(6)}]`
            // map.queryRenderedFeatures(e.point)?.[0]?.id
        )
        const clickable_feat = find_clickable_feat(e.point)
        if (clickable_feat) {
            try_open_building(clickable_feat.id, true, true)
        } else if (!panel.is_pristine()) {
            panel.set_size(0)
        }
    })

    // ADD & REMOVE CURSOR POINTER ON BUILDINGS WITH DETAILS
    // potentially_clickable_layers.forEach(layer => {
    map.on('mousemove', (e) => {
        if (map.getZoom() > CURSOR_POINTER_MINZOOM
            && map.queryRenderedFeatures(e.point)
                .find(f => f.id && is_feature_selectable(f.id))
        ) {
            map.getCanvas().style.cursor = 'pointer'
        } else {
            map.getCanvas().style.cursor = 'auto'
        }
    })






    document.querySelector('#non-panel #highlights-opener').addEventListener('click', () => {
        display_highlights(true)
    })


    is_mouse_device && document.body.addEventListener('mouseover', debounce((e) => {

        if (e.target.closest('#highlights-opener')) {
            show_tooltip({
                triggerEl: e.target.closest('#highlights-opener'),
                text: `Open highlights`,
                position: 'left',
                textNoWrap: true
            })
        }

        if (e.target.closest('.bldg-link')) {
            show_tooltip({
                triggerEl: e.target.closest('.bldg-link'),
                text: `Go to building`,
                position: 'top',
                offset: 5
            })
        }
    }), 300)


    // On click on any .bldg-link (in slider or thumbs-list), go to a bldg that owns the image
    document.body.addEventListener('click', async (e) => {

        if (e.target.closest('.bldg-link')) {
            const img_src = e.target.getAttribute('img-src')
            if (!img_src) {
                console.warn(`handling click on .bldg-link, img-src attr is empty, it's not normal`)
                return
            }
            const img_name = img_src.split('/').pop()
            const bldg_id = find_bldg_id_by_image_filename(decodeURIComponent(img_name))

            const open_building_delay = is_mouse_device
                ? 0 // because pswp has no closing animation on desktop
                : PSWP_HIDE_ANIMATION_DURATION + 200
            setTimeout(
                () => try_open_building(bldg_id, true, true),
                open_building_delay
            )
            lightbox?.pswp?.close()


        }

        if (e.target.closest('#gotogoogle')) {
            const bounds = window.dalatmap.getBounds()
            const sw = bounds.getSouthWest()
            const ne = bounds.getNorthEast()

            const centerLat = (sw.lat + ne.lat) / 2
            const centerLng = (sw.lng + ne.lng) / 2
            const googleZoom = Math.round(window.dalatmap.getZoom())

            const url = `https://www.google.com/maps/@${centerLat},${centerLng},${googleZoom}z`
            window.open(url, '_blank')
        }
    })

    initialize_custom_zoom_buttons()

}
