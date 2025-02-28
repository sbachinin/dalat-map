import { panel } from './panel/panel.mjs'
import { display_highlights } from './highlights.mjs'
import { building_has_details, try_open_building } from './bldg_details.mjs'
import { french_polygons_layers } from './layers/french_polygons.mjs'
import {
    dead_building_fill,
    dead_building_skull
} from './dead_buildings.mjs'
import { french_buildings_titles } from './layers/titles.mjs'
import { CURSOR_POINTER_MINZOOM } from './layers/constants.mjs'
import { find_bldg_id_by_image_filename } from './utils.mjs'
import { lightbox } from './panel/init_photoswipe.mjs'




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
            && building_has_details(clickable_feat.id)
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
                && building_has_details(e.features[0].id)
            ) {
                map.getCanvas().style.cursor = 'pointer'
            }
        })

        map.on('mouseleave', layer, (e) => {
            const rfs = map.queryRenderedFeatures(e.point)
            if (!rfs.find(f => f.id && building_has_details(f.id))) {
                map.getCanvas().style.cursor = ''
            }
        })
    })
}

document.querySelector('#highlights-opener').addEventListener('click', () => {
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
        lightbox.pswp.close() // must do it before try_open_building, otherwise failure when scrolling the thumb list to current index
        try_open_building(bldg_id, true, true)
    }
})
