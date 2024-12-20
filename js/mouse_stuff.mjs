import meta from './french_buildings_meta.mjs'
import { panel } from './panel/panel.mjs'


const buildingHasDetails = featureMeta => {
    return featureMeta && (featureMeta.images || featureMeta.descr)
}

const imageFadingDuration = 160
document.documentElement.style.setProperty('--image-fading-duration', `${imageFadingDuration / 1000}s`);

const detailsEl = document.querySelector('#building-details')

const showFrenchDetails = (details) => {

    const expandDetailsPromise = new Promise(resolve => {
        if (panel.isExpanded()) {
            resolve()
        } else {
            panel.expand()
            setTimeout(resolve, 210)
        }
    })

    if (details.images?.length) {

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
        })

        // request new photos
        for (const imgName of details.images) {
            const imgEl = document.createElement('img')
            imgEl.className = 'hidden'

            imgEl.src = `https://sbachinin.github.io/dalat-map-images/thumbs/${imgName}.jpg`
            imgEl.onload = () => {
                // make sure old ones has finished fading out
                Promise.all([fadeOutPromise, expandDetailsPromise]).then(() => {
                    // hide loader
                    // ..................................
                    // add new photos
                    imagesEl.appendChild(imgEl)
                    // transition new photos to 1 opacity
                    setTimeout(() => {
                        imgEl.classList.remove('hidden')
                    }, 50)
                })
                imgEl.onload = null
            };
        }
    }

    // show description
}



export const addMouseStuff = map => {

    return
    // OPEN DETAILS OF A CLICKED BUILDING
    let selectedBuildingId = null

    map.on('click', (e) => {
        const maybeFrenchBuilding = map.queryRenderedFeatures(e.point)
            .find(f => f.layer.id === 'French building')

        const isAlreadySelected = maybeFrenchBuilding?.id === selectedBuildingId
        if (isAlreadySelected) return

        const featureMeta = meta[maybeFrenchBuilding?.id]

        if (maybeFrenchBuilding && buildingHasDetails(featureMeta)) {
            selectedBuildingId = maybeFrenchBuilding?.id
            showFrenchDetails(featureMeta)
        } else {
            selectedBuildingId = null
            panel.collapse()
            setTimeout(() => { imagesEl.innerHTML = '' }, 170)
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
