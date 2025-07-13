import { current_city, onload_city } from "../load_city.mjs";
import { create_element_from_Html } from "../utils/frontend_utils.mjs";
import { save_string_to_file } from "./save_string_to_file.mjs";

document.querySelector('#maplibregl-map').addEventListener("dragover", e => {
    e.preventDefault()
});

/*
    Drop image to a building on the map -> add filename to this building's images array.
    ATM I just use a runtime array from current_city.fids_to_img_names[fid].
    Previously, I used localStorage but chose to simplify it
    Because keeping the unsaved changes between pageloads is a lot of work with little reward.
    So now changes are lost unless saved to the file.
    Therefore fat red warning-button is shown to save to the file.
    Once the button is clicked, it disappears, no matter how successful was saving to a file.
    So it's a bit flaky but so far I don't find it necessary to perfect this.

    One possible source of bugs here (not tested yet) is how it behaves when switching cities at runtime.
*/

onload_city(city => {
    localStorage.setItem(
        city.name + '_fids_to_img_names',
        JSON.stringify(city.fids_to_img_names)
    )
})

document.querySelector('#maplibregl-map').addEventListener("drop", e => {
    e.preventDefault()

    // check that file is ok

    const file = e.dataTransfer.files[0]
    if (!file) { console.warn('no file dropped'); return }
    if (file.name.endsWith('.heic') || file.name.endsWith('.HEIC')) {
        console.warn(`HEIC file shouldn't be dropped here. Drop only files that will be eventually used on a page (of compatible formats)`)
        return
    }

    // check that file was dropped on a building

    const rf = window.dalatmap.queryRenderedFeatures([e.clientX, e.clientY])
    if (
        !rf[0].sourceLayer.includes('building')
        || rf[0].layer.type !== 'fill'
    ) {
        console.warn('not a building')
        return
    }

    // check if such image wasn't already saved for such building

    const feat_id = rf[0].id
    current_city.fids_to_img_names[feat_id] = current_city.fids_to_img_names[feat_id] || []

    if (current_city.fids_to_img_names[feat_id].includes(file.name)) {
        console.log('already have such filename for this feature')
        return
    }

    // add image

    current_city.fids_to_img_names[feat_id].push(file.name)
    console.log(
        'Added a new img name. Total images count: ',
        Object.values(current_city.fids_to_img_names).flat().length
    )

    // add "save to file" warning-button

    if (!document.querySelector('#save-ids-to-imgs')) {
        const button = create_element_from_Html(
            `<div style="
                position: fixed; top: 0; 
                background: blue; color: red; cursor: pointer;
                padding: 6px 12px; font-family: verdana;
            " id="save-ids-to-imgs">Maybe there are unsaved fids_to_img_names, click here to save to ./cityname/static_data/fids_to_img_names.mjs</div>`
        )
        document.body.appendChild(button)
        button.addEventListener('click', async () => {
            const str = JSON.stringify(current_city.fids_to_img_names, null, 4)
            save_string_to_file(
                `export const fids_to_img_names = ${str}`,
                'fids_to_img_names.mjs'
            )
            button.remove()
        })
    }

})
