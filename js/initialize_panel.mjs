import { try_open_building } from "./bldg_details.mjs"
import { DEV_should_open_panel_on_pageload } from "./DEV/constants.mjs"
import { display_highlights } from "./highlights.mjs"
import { panel } from "./panel/panel.mjs"
import { is_feature_selectable } from "./utils/does_feature_have_details.mjs"
import { get_bldg_id_from_url } from "./utils/utils.mjs"

export const initialize_panel = () => {
    return new Promise(resolve => {

        const should_open_panel = DEV_should_open_panel_on_pageload

        if (should_open_panel) {
            if (is_feature_selectable(get_bldg_id_from_url())) {
                try_open_building(get_bldg_id_from_url(), false, false)
            } else {
                display_highlights()
            }
            panel.once('begin transition to new size', 'app', resolve)
            panel.expand_button_el.classList.add('inward')
        } else {
            panel.wrapper_element.classList.remove('pristine') // TODO? not "pristine" but "waiting-for-first-expand-transition"
            resolve()
        }
        panel.on('content is missing', 'app', display_highlights)
        panel.expand_button_el.classList.remove('hidden')
    })
}