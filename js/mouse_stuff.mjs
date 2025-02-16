import { panel } from './panel/panel.mjs'
import { display_highlights } from './highlights.mjs'
import { building_has_details, try_open_building } from './bldg_details.mjs'
import { french_polygons_layers } from './layers/french_polygons.mjs'
import {
    dead_building_fill,
    dead_building_skull
} from './dead_buildings.mjs'
import {
    french_buildings_titles
} from './layers/titles.mjs'




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
        const has_details = building_has_details(clickable_feat?.id)
        if (clickable_feat && has_details) {
            try_open_building(clickable_feat.id, true, true)
        } else {
            panel.set_size(0)
        }
    })

    // ADD & REMOVE CURSOR POINTER ON BUILDINGS WITH DETAILS
    potentially_clickable_layers.forEach(layer => {
        map.on('mousemove', layer, (e) => {
            if (map.getZoom() > 15
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