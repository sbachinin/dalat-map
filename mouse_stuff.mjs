import meta from './french_buildings_meta.mjs'

const buildingHasDetails = featureMeta => {
    return featureMeta && (featureMeta.images || featureMeta.descr)
}

const imageFadingDuration = 160
document.documentElement.style.setProperty('--image-fading-duration', `${imageFadingDuration / 1000}s`);

const detailsEl = document.querySelector('.details')
const detailsExpanderEl = document.querySelector('.details-expander')
const imagesEl = detailsEl.querySelector('.images')
const fsPhotoEl = document.querySelector('.fullscreen-photo')

const showFrenchDetails = (details) => {

    const expandDetailsPromise = new Promise(resolve => {
        if (detailsExpanderEl.classList.contains('expanded')) {
            resolve()
        } else {
            detailsExpanderEl.classList.add('expanded')
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
            };
        }
    }

    // show description
}



export const addMouseStuff = map => {

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
            detailsExpanderEl.classList.remove('expanded')
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

    // OPEN LARGER PHOTO ON CLICK
    imagesEl.addEventListener('click', e => {
        if (e.target.tagName !== "IMG") return
        const imgEl = document.createElement('img')
        imgEl.src = e.target.src
        fsPhotoEl.appendChild(imgEl)
        fsPhotoEl.classList.remove('hidden')
    })

    // CLOSE LARGE PHOTO WHEN CLICK OUTSIDE
    fsPhotoEl.addEventListener('click', e => {
        setTimeout(() => {
            if (e.target.tagName === "IMG") return // OR SWITCH TO THE NEXT PHOTO?
            fsPhotoEl.innerHTML = ''
            fsPhotoEl.classList.add('hidden')
        })
    })
}
