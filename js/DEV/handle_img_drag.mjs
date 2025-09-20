import { display_highlights } from "../highlights.mjs";
import { current_city, onload_city } from "../load_city.mjs";
import { try_open_building } from "../panel/bldg_details.mjs";
import { before_last_dot, create_element_from_Html } from "../utils/frontend_utils.mjs";
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

const rendered_feat_is_bldg = f => {
    // Looks like there is no 100% reliable way to answer this question
    // because features don't necessarily (and perhaps never) contain something like properties.building === true
    // (such properties are removed on tile generation, and they are not provided for renderables, etc, etc, so it's difficult to solve)
    // But some rendered feature's props can give a clue
    if (f.sourceLayer?.includes('building') || f.source?.includes('bldg')) return true
    if (f.source?.includes('building') || f.source?.includes('bldg')) return true
    if (f.layer.id.includes('building') || f.layer.id.includes('bldg')) return true
    if (f.properties?.renderable_id?.includes('building') || f.properties?.renderable_id?.includes('bldg')) return true
    return false
}

document.querySelector('#maplibregl-map').addEventListener("drop", e => {
    e.preventDefault()

    // check that file is ok

    const file = e.dataTransfer.files[0]
    if (!file) { console.warn('no file dropped'); return }

    // check that file was dropped on a building

    const rf = window.dalatmap.queryRenderedFeatures([e.clientX, e.clientY])
    const building = rf.find(rendered_feat_is_bldg)

    if (!building) {
        console.warn('no building at this screen point')
        return
    }

    const feat_id = building.id
    current_city.fids_to_img_names[feat_id] = current_city.fids_to_img_names[feat_id] || []

    const basename = before_last_dot(file.name)

    if (current_city.fids_to_img_names[feat_id].includes(basename)) {
        console.log('already have such file basename for this feature')
        return
    }

    // add image

    current_city.fids_to_img_names[feat_id].push(basename)
    console.log(
        'Added a new img basename. Total images count: ',
        Object.values(current_city.fids_to_img_names).flat().length
    )

    // open & refresh the panel with this building details
    // (-> make sure the image was added to the right building,
    // because detection of what feature was the "drop target" is not completely reliable)
    display_highlights(false)
    try_open_building(feat_id)

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
