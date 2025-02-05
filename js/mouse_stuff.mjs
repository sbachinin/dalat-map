import { all_handmade_data } from '../data/static/handmade_data.mjs'
import { panel } from './panel/panel.mjs'
import { display_highlights } from './highlights.mjs'
import { building_has_details, try_open_building } from './bldg_details.mjs'

export const addMouseStuff = () => {
    const map = window.dalatmap

    const clickable_layers = ['French building',
        'Dead building fill',
        'French buildings titles',
        'French buildings tiny squares with titles'
    ]

    map.on('click', (e) => {
        // navigator?.clipboard?.writeText?.(
        //     `[${e.lngLat.lng}, ${e.lngLat.lat}]`
        //     // map.queryRenderedFeatures(e.point)?.[0]?.id
        // )
        const rfs = map.queryRenderedFeatures(e.point)
        const clicked_french_polygon = rfs.find(f => (
            clickable_layers.includes(f.layer.id)
        ))
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
        map.on('mouseleave', layer, () => {
            map.getCanvas().style.cursor = ''
        })
    })
}

document.querySelector('#highlights-opener').addEventListener('click', () => {
    display_highlights(true)
})