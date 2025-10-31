import { display_highlights } from "./highlights.mjs"
import { CAUSE, histoire } from "./histoire.mjs"
import { try_open_building } from "./panel/bldg_details.mjs"
import { panel } from "./panel/panel.mjs"
import { update_selected_map_features } from "./update_selected_feaures.mjs"
import { is_feature_selectable } from "./utils/does_feature_have_details.mjs"
import { create_element_from_Html, panel_was_expanded } from "./utils/frontend_utils.mjs"

export const handle_id_change = () => {

    update_selected_map_features()

    const { id, cause } = histoire.entries[histoire.entries.length - 1]

    if (typeof id === 'number'
        && is_feature_selectable(id)
    ) {
        let should_expand_panel = true
        if (cause === CAUSE.INITIALIZE_CITY) {
            should_expand_panel = panel_was_expanded()
        } else if (cause === 'popstate') {
            should_expand_panel = false
        }

        panel.is_about_to_expand = should_expand_panel

        try_open_building(id, {
            should_try_to_fly: true,
        })
    } else if (id === 'menu') {
        // 1. links to other cities
        // 2. link to world map
        // 3. maybe, a link to google maps (if it's not shown outside the panel)
        // 4. maybe, a show user location button (if it's not shown outside the panel)
        // 5. ?? lists of highlights (if they don't belong to legend)
        // 6. about the map (pictograms, text)
        panel.set_content({
            element: create_element_from_Html(`<div>Menu
                <a data-href-id="about">About</a>
                </div>`)
        })
    } else if (id === 'about') {
        panel.set_content({
            element: create_element_from_Html(`<div>About (legend and textual summary)</div>`),
        })
    } else if (typeof id === 'string') {
        // it must be ONE OF lists of highlights images
        // But for now, it's just good old "highlights", shown in case id is any string other than "menu"
        // ^ to fix

        // if initialize and panel wasn't expanded, don't
        // (but display_h... fn doesn't have such argument)
        // same for ^ menu
        display_highlights()
    } else if (id === null) {
        panel.set_content({
            element: create_element_from_Html(`<div>intro</div>`),
        })
        // intro:
        // A one-off piece of content that is shown for a user who visits a city for the first time.
        // It can be "navigated back to", but otherwise this "page" shouldn't be accessible later. (Pieces of info shown on it will be found in legend, menu or elsewhere).
        // 1. a briefest explanation of what you see: "This is a map of Dalat (Vietnam), focused on (but not limited to) its colonial architecture, reflecting its condition in 2024-25. Read more about the map here".
        // 2. icons with explanations
        // [orange rect with bleak text and no border]: colonial building (of colonial period and style)
        // [blue rect with bleak text and no border]: other notable building
        // [both rects with border and thick title]: buildings with border are clickable and have some photos or other info
        // 3. "meta highlights lists" or links to highlights lists
        // perhaps better be defined for a city: if there are many lists, show a list of lists; otherwise "the best"
    } else {
        console.error('id is of invalid type')
    }
}
