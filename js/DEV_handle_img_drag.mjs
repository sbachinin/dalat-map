document.querySelector('#map').addEventListener("dragover", e => {
    e.preventDefault()
});

localStorage.setItem("ids_to_imgs", localStorage.getItem("ids_to_imgs") || '{}')

document.querySelector('#map').addEventListener("drop", e => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file) { console.warn('no file dropped'); return }

    const rf = map.queryRenderedFeatures([e.clientX, e.clientY])
    if (
        rf[0].sourceLayer.includes('building')
        && rf[0].layer.type === 'fill'
    ) {
        const feat_id = rf[0].id
        const ids_to_imgs = JSON.parse(localStorage.getItem("ids_to_imgs"))
        const imgs = ids_to_imgs[feat_id] = ids_to_imgs[feat_id] || []
        if (imgs.includes(file.name)) {
            console.warn('already have such filename for this feature')
        } else {
            imgs.push(file.name)
            console.log('imgs length: ', Object.values(ids_to_imgs).flat().length)
            localStorage.setItem("ids_to_imgs", JSON.stringify(ids_to_imgs))
        }
    } else {
        console.warn('not a building')
    }
})
