import { download_json } from "../../chores/download_json.mjs";
import { current_city as city, onload_city } from "../load_city.mjs";
import { create_element_from_Html } from "../utils/utils.mjs";

document.querySelector('#maplibregl-map').addEventListener("dragover", e => {
    e.preventDefault()
});

/*
    When I drop image to a building polygon,
    image name (with extension) is added to the building's images array kept in local storage.
    At this point, there is a danger that this "temporary" info in LS will be lost.
    It can happen, e.g., when I increment a port number or change the subdomain -
        and after such a change I have an empty localStorage (because it's scoped to a particular port and subdomain),
        and old unsaved data is still there but for some previous origin,
        and it will be just forgotten and, even if not, will be hard to recover.
    For this reason I give a huge warning that this stuff must be save to a file by click.
    Once the button is clicked, it disappears regardless of whether save succeeds or not.
    So it's a bit flaky but kinda safe because localstorage is not emptied, and why would I fail to save it?

    TODO: check how this works after switch to another city
    (though I'm not sure that it's a valid scenario: I expect to be concerned with 1 particular city while populating the images names)
*/

// on city load (because i don't want to make it for all cities because then i need to keep a list of them),
// put stuff from file to lsname
// just overwrite everything, meaning that unsaved changes will be erased completely once the city is loaded again. But making it more safe is a lot of work

onload_city(city => {
    localStorage.setItem(
        city.name + '_fids_to_imgs',
        JSON.stringify(city.fids_to_imgs)
    )
})

document.querySelector('#maplibregl-map').addEventListener("drop", e => {
    e.preventDefault()

    const lsname = city.name + '_fids_to_imgs'

    const fresh_fids_to_imgs = JSON.parse(localStorage.getItem(lsname)) || {}

    const file = e.dataTransfer.files[0]
    if (!file) { console.warn('no file dropped'); return }
    if (file.name.endsWith('.heic') || file.name.endsWith('.HEIC')) {
        console.warn(`HEIC file shouldn't be dropped here. Drop only files that will be eventually used on a page (of compatible formats)`)
        return
    }

    const rf = window.dalatmap.queryRenderedFeatures([e.clientX, e.clientY])
    if (
        !rf[0].sourceLayer.includes('building')
        || rf[0].layer.type !== 'fill'
    ) {
        console.warn('not a building')
        return
    }

    const feat_id = rf[0].id
    const imgs = fresh_fids_to_imgs[feat_id] = fresh_fids_to_imgs[feat_id] || []
    if (imgs.includes(file.name)) {
        console.warn('already have such filename for this feature')
        return
    }

    imgs.push(file.name)
    console.log('Added a new img name. Total images count: ', Object.values(fresh_fids_to_imgs).flat().length)
    localStorage.setItem(lsname, JSON.stringify(fresh_fids_to_imgs))



    if (!document.querySelector('#save-ids-to-imgs')) {
        const button = create_element_from_Html(
            `<div style="
                position: fixed; bottom: 0; 
                background: white; color: red; cursor: pointer;
                padding: 6px 12px; font-size: 32px; font-family: verdana;
            " id="save-ids-to-imgs">Maybe there are unsaved fids_to_imgs in localStorage, click here to save to fids_to_img_names.mjs</div>`
        )
        document.body.appendChild(button)
        button.addEventListener('click', async () => {

            const { fids_to_img_names: old_fids_to_imgs } = await import(`../../${city.name}/static_data/fids_to_img_names.mjs`)

            const merged = { ...old_fids_to_imgs }
            Object.keys(fresh_fids_to_imgs).forEach(key => {
                if (merged[key]) {
                    merged[key] = [...merged[key], ...fresh_fids_to_imgs[key]]
                } else {
                    merged[key] = fresh_fids_to_imgs[key]
                }
            })

            download_json(merged)
            button.remove()
        })
    }

})
