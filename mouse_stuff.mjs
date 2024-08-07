import meta from './french_buildings_meta.mjs'

const buildingHasDetails = featureMeta => {
    return featureMeta && (featureMeta.images || featureMeta.descr)
}


const detailsEl = document.querySelector('.details')
const imagesEl = detailsEl.querySelector('.images')
const fsPhotoEl = document.querySelector('.fullscreen-photo')

const showFrenchDetails = (details) => {

    if (details.images?.length) {
        imagesEl.innerHTML = ''
        for (const imgName of details.images) {
            const imgEl = document.createElement('img')
            imgEl.src = `./buildings_photos/${imgName}.jpg`
            imagesEl.appendChild(imgEl)
        }
    }

    // show description

    detailsEl.classList.remove('hidden')
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
            imagesEl.innerHTML = ''
            selectedBuildingId = null
            detailsEl.classList.add('hidden')
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
