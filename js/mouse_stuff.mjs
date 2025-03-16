import { panel } from './panel/panel.mjs'
import { display_highlights } from './highlights.mjs'
import { fly_to_building, try_open_building } from './bldg_details.mjs'
import { french_polygons_layers } from './layers/french_polygons.mjs'
import {
    dead_building_fill,
    dead_building_skull
} from './dead_buildings.mjs'
import { french_buildings_titles } from './layers/titles.mjs'
import { CURSOR_POINTER_MINZOOM } from './layers/constants.mjs'
import { find_bldg_id_by_image_filename, is_mouse_device } from './utils.mjs'
import { lightbox, PSWP_HIDE_ANIMATION_DURATION } from './panel/init_photoswipe.mjs'
import { initialize_custom_zoom_buttons } from './custom_zoom_buttons.mjs'
import { does_building_have_details } from './does_building_have_details.mjs'
import { selected_building_id } from './select_building.mjs'




const potentially_clickable_layers = [
    ...french_polygons_layers.map(l => l.id), // therefore detailless layers are inculded too so they have to be filtered out ad hoc
    dead_building_fill.id,
    dead_building_skull.id,
    french_buildings_titles.id,
]

export const add_mouse_stuff = () => {
    const map = window.dalatmap

    map.on('click', (e) => {
        // navigator?.clipboard?.writeText?.(
        //     `[${e.lngLat.lng}, ${e.lngLat.lat}]`
        //     // map.queryRenderedFeatures(e.point)?.[0]?.id
        // )
        const rfs = map.queryRenderedFeatures(e.point)
        const clickable_feat = rfs.find(f => potentially_clickable_layers.includes(f.layer.id))
        if (clickable_feat
            && does_building_have_details(clickable_feat.id)
        ) {
            try_open_building(clickable_feat.id, true, true)
        } else {
            panel.set_size(0)
        }
    })

    // ADD & REMOVE CURSOR POINTER ON BUILDINGS WITH DETAILS
    potentially_clickable_layers.forEach(layer => {
        map.on('mousemove', layer, (e) => {
            if (map.getZoom() > CURSOR_POINTER_MINZOOM
                && e.features[0].layer.id !== french_buildings_titles.id
                && does_building_have_details(e.features[0].id)
            ) {
                map.getCanvas().style.cursor = 'pointer'
            }
        })

        map.on('mouseleave', layer, (e) => {
            const rfs = map.queryRenderedFeatures(e.point)
            if (!rfs.find(f => f.id && does_building_have_details(f.id))) {
                map.getCanvas().style.cursor = ''
            }
        })
    })







    document.querySelector('#non-panel #highlights-opener').addEventListener('click', () => {
        display_highlights(true)
    })





    // On click on any .bldg-link (in slider or thumbs-list), go to a bldg that owns the image
    document.body.addEventListener('click', e => {

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

        } else if (e.target.closest('#building-info__flyto')) {
            fly_to_building(selected_building_id)
        }
    })

    initialize_custom_zoom_buttons()

}
