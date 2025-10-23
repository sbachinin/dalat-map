import { try_open_building } from "./bldg_details.mjs"
import { display_highlights } from "../highlights.mjs"
import { panel } from "./panel.mjs"
import { is_feature_selectable } from "../utils/does_feature_have_details.mjs"
import { get_bldg_id_from_url } from "../utils/frontend_utils.mjs"

export const initialize_panel = () => {
    return new Promise(resolve => {

        const selected_bldg_id = get_bldg_id_from_url(window.location.href)
        
        const should_expand_panel = localStorage.getItem('panel_was_expanded') !== 'false'

        if (is_feature_selectable(selected_bldg_id)) {
            // * even if panel isn't expanded, selected building must still be "opened" (just "chosen", silently for now)
            try_open_building(selected_bldg_id, {
                should_push_history: false,
                should_try_to_fly: false,
                should_expand_panel
            })
        } else if (should_expand_panel) {
            display_highlights({ should_push_history: false })
        }

        if (should_expand_panel) {
            panel.once('begin transition to new size', 'app', resolve)
            panel.expand_button_el.classList.add('inward')
        } else {
            panel.wrapper_element.classList.remove('pristine') // TODO? not "pristine" but "waiting-for-first-expand-transition"
            resolve()
        }

        panel.on(
            'content is missing',
            'fuck',
            () => display_highlights({ should_push_history: false })
        )
        panel.expand_button_el.classList.remove('hidden')
    })
}