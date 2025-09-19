const params = new URLSearchParams(location.search)
const cityname = params.get('city')
if (!cityname) {
    document.getElementById('output').textContent = '(no city provided)'
} else {
    const fids_path = `../${cityname}/static_data/fids_to_img_names.mjs`
    const unassigned_images_path = `../${cityname}/static_data/unassigned_images.mjs`
    Promise.allSettled([
        import(fids_path),
        import(unassigned_images_path)
    ]).then(res => {
        display_bldgs_images(cityname, res[0].value.fids_to_img_names)
        display_unassigned_images(cityname, res[1].value?.unassigned_images)
    })
}

function display_bldgs_images(cityname, ftin) {
    for (const [fid, images_basenames] of Object.entries(ftin)) {
        const section = document.createElement('div')
        section.classList.add('one-building')

        const id_link = document.createElement('a')
        id_link.classList.add('id-link')
        id_link.target = '_blank'
        id_link.href = `./${cityname}/?id=${fid}`
        id_link.textContent = `FID ${fid}`
        section.appendChild(id_link)

        images_basenames.forEach(basename => {
            const img = document.createElement('img')
            img.src = `../cities_images/${cityname}/dist/thumbs/${basename}.jpg`
            img.loading = "lazy"
            section.appendChild(img)
        })

        document.getElementById('output').appendChild(section)
    }
}

function display_unassigned_images(cityname, unassigned_images) {
    if (!unassigned_images) {
        return
    }
    const section = document.createElement('div')
    section.classList.add('unassigned-images')
    section.innerHTML = '<h2>Unassigned images</h2>'
    unassigned_images.forEach(basename => {
        const img = document.createElement('img')
        img.src = `../cities_images/${cityname}/dist/thumbs/${basename}.jpg`
        img.loading = "lazy"
        section.appendChild(img)
    })
    document.getElementById('output').appendChild(section)
}