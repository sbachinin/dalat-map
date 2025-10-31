import { display_highlights } from "../highlights.mjs"
import { panel_was_expanded } from "../utils/frontend_utils.mjs"
import { panel } from "./panel.mjs"

export const initialize_panel = () => {
        const should_expand_panel = panel_was_expanded()

        if (should_expand_panel) {
            panel.expand_button_el.classList.add('inward')
        } else {
            panel.wrapper_element.classList.remove('pristine') // TODO ? not "pristine" but "waiting-for-first-expand-transition"
        }

        panel.on(
            'content is missing',
            'fuck',
            () => display_highlights() // TODO display what's in the url? or menu?
        )
        panel.expand_button_el.classList.remove('hidden')
}