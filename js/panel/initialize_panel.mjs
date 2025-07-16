import { try_open_building } from "./bldg_details.mjs"
import { DEV_should_open_panel_on_pageload } from "../DEV/constants.mjs"
import { display_highlights } from "../highlights.mjs"
import { panel } from "./panel.mjs"
import { is_feature_selectable } from "../utils/does_feature_have_details.mjs"
import { get_bldg_id_from_url } from "../utils/frontend_utils.mjs"

export const initialize_panel = () => {
    return new Promise(resolve => {

        const should_open_panel = DEV_should_open_panel_on_pageload
        const selected_bldg_id = get_bldg_id_from_url()

        if (is_feature_selectable(selected_bldg_id)) {
            // * even if panel isn't expanded, selected building must is still "opened" (just "chosen", silently for now)
            try_open_building(selected_bldg_id, false, false, should_open_panel)
        } else if (should_open_panel) {
            display_highlights()
        }

        if (should_open_panel) {
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