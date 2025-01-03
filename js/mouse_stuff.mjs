import meta from './french_buildings_meta.mjs'
import { panel } from './panel/panel.mjs'
import { create_lazy_image } from './lazy-image.mjs'
import { get_image_url } from './utils.mjs'
import { display_highlights } from './highlights.mjs'

const buildingHasDetails = featureMeta => {
    return featureMeta && (featureMeta.images/*  || featureMeta.descr */)
}

const imageFadingDuration = 160
document.documentElement.style.setProperty('--image-fading-duration', `${imageFadingDuration / 1000}s`);

const show_french_details = (details) => {
    if (!details.images?.length) return

    const img_elements = details.images.map(name => {
        return create_lazy_image(get_image_url(name, 'thumbs'))
    })

    const details_el = document.createElement('div')
    details_el.id = 'building-details'

    img_elements.forEach(el => details_el.appendChild(el));

    panel.set_content({
        update: () => { },
        element: details_el
    })

    panel.expand()
}

let selectedBuildingId = null

const select_bldg = newid => {
    const oldid = selectedBuildingId
    selectedBuildingId = newid
    if (oldid) {
        map.setFeatureState(
            { source: 'dalat-tiles', sourceLayer: 'french_building', id: oldid },
            { selected: false }
        )
    }
    if (newid) {
        map.setFeatureState(
            { source: 'dalat-tiles', sourceLayer: 'french_building', id: newid },
            { selected: true }
        )
    }
}

export const addMouseStuff = map => {

    map.on('click', (e) => {
        const maybeFrenchBuilding = map.queryRenderedFeatures(e.point)
            .find(f => f.layer.id === 'French building')

        if (!maybeFrenchBuilding) {
            panel.set_size(0)
            select_bldg(null)
            return
        }

        const featureMeta = meta[maybeFrenchBuilding?.id]

        if (maybeFrenchBuilding && buildingHasDetails(featureMeta)) {
            show_french_details(featureMeta)
            select_bldg(maybeFrenchBuilding.id)
        }
    })

    // ADD & REMOVE CURSOR POINTER ON BUILDINGS WITH DETAILS
    map.on('mousemove', 'French building', (e) => {
        if (e.features.length === 0) return
        if (map.getZoom() < 15.5) return
        if (!buildingHasDetails(meta[e.features[0].id])) return
        map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mouseleave', 'French building', () => {
        map.getCanvas().style.cursor = ''
    })
}

document.querySelector('#highlights-opener').addEventListener('click', () => {
    select_bldg(null)
    display_highlights()
})