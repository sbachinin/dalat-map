import meta from './french_buildings_meta.mjs'

export const addMouseStuff = map => {
    const detailsEl = document.querySelector('.details')
    const imagesEl = detailsEl.querySelector('.images')

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

    let selectedBuildingId = null

    map.on('click', (e) => {
        
        const maybeFrenchBuilding = map.queryRenderedFeatures(e.point).find(f => f.layer.id === 'French building')

        const isAlreadySelected = maybeFrenchBuilding?.id === selectedBuildingId
        if (isAlreadySelected) return

        const featureMeta = meta[maybeFrenchBuilding?.id]
        const hasDetails = featureMeta && (featureMeta.images || featureMeta.descr)

        if (maybeFrenchBuilding && hasDetails) {
            selectedBuildingId = maybeFrenchBuilding?.id
            showFrenchDetails(featureMeta)
        } else {
            imagesEl.innerHTML = ''
            selectedBuildingId = null
            detailsEl.classList.add('hidden')
        }
    })

    // let hoveredBuildingId = null

    // map.on('mousemove', 'French building', (e) => {

    //     if (e.features.length > 0) {

    //         if (hoveredBuildingId) {
    //             map.setFeatureState(
    //                 {source: 'dalat-tiles', sourceLayer: 'building', id: hoveredBuildingId},
    //                 {hover: false}
    //             );
    //         }

    //         if (map.getZoom() < 15.5) return
            
    //         map.getCanvas().style.cursor = 'pointer'

    //         hoveredBuildingId = e.features[0].id
    //         map.setFeatureState(
    //             {source: 'dalat-tiles', sourceLayer: 'building', id: hoveredBuildingId},
    //             {hover: true}
    //         );
    //     }
    // });

    // map.on('mouseleave', 'French building', () => {
    //     map.getCanvas().style.cursor = ''
    //     if (hoveredBuildingId) {
    //         map.setFeatureState(
    //             {source: 'dalat-tiles', sourceLayer: 'building', id: hoveredBuildingId},
    //             {hover: false}
    //         );
    //     }
    //     hoveredBuildingId = null;
    // });
}
