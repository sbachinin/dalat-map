const params = new URLSearchParams(location.search)
const city = params.get('city')
if (!city) {
    document.getElementById('output').textContent = '(no city provided)'
} else {
    const modulePath = `../${city}/static_data/fids_to_img_names.mjs`
    import(modulePath).then(mod => {
        const ftin = mod.fids_to_img_names

        for (const [fid, images_basenames] of Object.entries(ftin)) {
            const section = document.createElement('div')
            section.classList.add('one-building')

            const id_link = document.createElement('a')
            id_link.classList.add('id-link')
            id_link.target = '_blank'
            id_link.href = `./${city}/?id=${fid}`
            id_link.textContent = `FID ${fid}`
            section.appendChild(id_link)

            images_basenames.forEach(basename => {
                const img = document.createElement('img')
                img.src = `../cities_images/${city}/dist/thumbs/${basename}.jpg`
                section.appendChild(img)
            })

            document.getElementById('output').appendChild(section)
        }
    })
}