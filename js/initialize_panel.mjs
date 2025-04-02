import { try_open_building } from "./bldg_details.mjs"
import { DEV_should_open_panel_on_pageload } from "./DEV/constants.mjs"
import { display_highlights } from "./highlights.mjs"
import { panel } from "./panel/panel.mjs"
import { get_bldg_id_from_href } from "./utils/utils.mjs"

export const initialize_panel = () => {
    return new Promise(resolve => {

        const should_open_panel = DEV_should_open_panel_on_pageload

        if (should_open_panel) {
            if (get_bldg_id_from_href() !== null) {
                try_open_building(get_bldg_id_from_href(), false, false)
            } else {
                display_highlights()
            }
            panel.once('new breadth was set', 'app', resolve)
            panel.expand_button_el.classList.add('inward')
        } else {
            panel.wrapper_element.classList.remove('pristine') // TODO? not "pristine" but "waiting-for-first-expand-transition"
            resolve()
        }
        panel.on('content is missing', 'app', display_highlights)
        panel.expand_button_el.classList.remove('hidden')
    })
}