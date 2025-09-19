const params = new URLSearchParams(location.search)
const cityname = params.get('city')
if (!cityname) {
    document.getElementById('output').textContent = '(no city provided)'
} else {
    const modulePath = `../${cityname}/static_data/fids_to_img_names.mjs`
    import(modulePath).then(mod => {
        const ftin = mod.fids_to_img_names
        display(cityname, ftin)
    })
}

function display(cityname, ftin) {
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