import meta from './french_buildings_meta.mjs'
import { panel } from './panel/panel.mjs'
import { create_lazy_image } from './lazy-image.mjs'
import { get_image_url } from './utils.mjs'

const buildingHasDetails = featureMeta => {
    return featureMeta && (featureMeta.images/*  || featureMeta.descr */)
}

const imageFadingDuration = 160
document.documentElement.style.setProperty('--image-fading-duration', `${imageFadingDuration / 1000}s`);

const showFrenchDetails = (details) => {

    /*     const expandDetailsPromise = new Promise(resolve => {
            if (panel.isExpanded()) {
                resolve()
            } else {
                panel.expand()
                setTimeout(resolve, 210)
            }
        }) */

    if (details.images?.length) {
        /* 
                const fadeOutPromise = new Promise(resolve => {
                    const oldImages = Array.from(imagesEl.querySelectorAll('img'))
                    if (oldImages.length === 0) {
                        resolve()
                        return
                    }
        
                    // transition old photos to 0 opacity
                    for (const oldImage of oldImages) {
                        oldImage.classList.add('hidden')
                    }
                    setTimeout(() => {
                        // remove old photos
                        for (const oldImage of oldImages) {
                            oldImage.remove()
                        }
                        // allow to show new photos after old photos finish fading out
                        resolve()
                        // show loader IF new are not there yet
                        // if (!newImagesHaveArrived) {}
                    }, imageFadingDuration + 50)
                }) */

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
}



export const addMouseStuff = map => {
    let selectedBuildingId = null

    map.on('click', (e) => {
        const maybeFrenchBuilding = map.queryRenderedFeatures(e.point)
            .find(f => f.layer.id === 'French building')

        if (!maybeFrenchBuilding) { panel.set_size(0); return }

        const isAlreadySelected = maybeFrenchBuilding?.id === selectedBuildingId
        if (isAlreadySelected) { panel.expand(); return }

        const featureMeta = meta[maybeFrenchBuilding?.id]

        if (maybeFrenchBuilding && buildingHasDetails(featureMeta)) {
            selectedBuildingId = maybeFrenchBuilding?.id
            showFrenchDetails(featureMeta)
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
