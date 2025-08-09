import { current_city } from "../load_city.mjs"
import { get_selected_building_id } from "../selected_building_id.mjs"
import { 
    can_share_files, 
    get_image_file_from_element,
    get_link_to_selected_bldg,
 } from "../utils/frontend_utils.mjs"

export const onclick_share = async () => {
    const bldg_data = current_city.all_handmade_data[get_selected_building_id()]

    let files = undefined // shouldn't pass files if sharing of files is not supported

    const img = document.querySelector('#building-details #panel-thumbs-list .slide-wrapper:first-child img')

    if (img && can_share_files()) {
        try {
            const file = await get_image_file_from_element(img)
            files = [file]
        } catch (error) {
            // TODO (Think. Basically if file fails, it doesn't prevent me from sharing other stuff)
            console.warn('Failed to get image file', error)
        }
    }

    let text = 'Map of French architecture of Da Lat'
    if (bldg_data?.title) {
        text += ` - ${bldg_data?.title}`
    }

    try {
        await navigator.share({
            title: 'Map of French architecture of Da Lat',
            url: get_link_to_selected_bldg(),
            text,
            files
        });
    } catch (error) {
        // Could show a "Fail" popup message or something BUT...
        // this catch is executed not only when smth bad happens
        // but also when you change your mind and close the share dialog
        // In such case no feedback is necessary
        // I don't want to investigate different kinds of failure
    }
}