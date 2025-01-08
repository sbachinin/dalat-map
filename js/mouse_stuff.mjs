import meta from './french_buildings_meta.mjs'
import { panel } from './panel/panel.mjs'
import { display_highlights } from './highlights.mjs'
import { building_has_details, try_open_building } from './bldg_details.mjs';
import { select_bldg } from './select_building.mjs';

export const addMouseStuff = map => {

    map.on('click', (e) => {
        const maybeFrenchBuilding = map.queryRenderedFeatures(e.point)
            .find(f => f.layer.id === 'French building'
                || f.layer.id === 'Dead building fill'
            )
        if (!maybeFrenchBuilding) {
            panel.set_size(0)
            return
        }
        try_open_building(maybeFrenchBuilding.id, true)
    })

    // ADD & REMOVE CURSOR POINTER ON BUILDINGS WITH DETAILS
    const clickable_layers = ['French building', 'Dead building fill']
    clickable_layers.forEach(layer => {
        map.on('mousemove', layer, (e) => {
            if (e.features.length === 0) return
            if (map.getZoom() < 15.5) return
            if (!building_has_details(meta[e.features[0].id])) return
            map.getCanvas().style.cursor = 'pointer'
        })
        map.on('mouseleave', layer, () => {
            map.getCanvas().style.cursor = ''
        })
    })
}

document.querySelector('#highlights-opener').addEventListener('click', () => {
    select_bldg(null)
    display_highlights()
})