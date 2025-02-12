import { all_handmade_data } from '../data/static/handmade_data.mjs'
import { panel } from './panel/panel.mjs'
import { display_highlights } from './highlights.mjs'
import { building_has_details, try_open_building } from './bldg_details.mjs'
import {
    french_important_building_fill,
    french_with_details_dark_outline,
    french_with_details_thickening_outline
} from './layers/french_polygons.mjs'
import {
    dead_building_fill,
    dead_building_skull
} from './dead_buildings.mjs'
import {
    french_buildings_tiny_squares_with_titles,
    french_buildings_titles
} from './layers/titles.mjs'




const clickable_layers = [
    french_important_building_fill.id,
    french_with_details_thickening_outline.id,
    french_with_details_dark_outline.id,
    dead_building_fill.id,
    dead_building_skull.id,
    french_buildings_titles.id,
    french_buildings_tiny_squares_with_titles.id
]

const is_clickable_feat = f => {
    return clickable_layers.includes(f.layer.id)
}

export const add_mouse_stuff = () => {
    const map = window.dalatmap

    map.on('click', (e) => {
        // navigator?.clipboard?.writeText?.(
        //     `[${e.lngLat.lng}, ${e.lngLat.lat}]`
        //     // map.queryRenderedFeatures(e.point)?.[0]?.id
        // )
        const rfs = map.queryRenderedFeatures(e.point)
        const clicked_french_polygon = rfs.find(is_clickable_feat)
        if (clicked_french_polygon) {
            try_open_building(clicked_french_polygon.id, true, true)
        } else {
            panel.set_size(0)
        }
    })

    // ADD & REMOVE CURSOR POINTER ON BUILDINGS WITH DETAILS
    clickable_layers.forEach(layer => {
        map.on('mousemove', layer, (e) => {
            if (e.features.length === 0) return
            if (map.getZoom() < 15.5) return
            const fid = all_handmade_data[e.features[0].id]
            if (!building_has_details(fid)) return
            map.getCanvas().style.cursor = 'pointer'
        })

        map.on('mouseleave', layer, (e) => {
            const rfs = map.queryRenderedFeatures(e.point)
            if (!rfs.find(is_clickable_feat)) {
                map.getCanvas().style.cursor = ''
            }
        })
    })
}

document.querySelector('#highlights-opener').addEventListener('click', () => {
    display_highlights(true)
})