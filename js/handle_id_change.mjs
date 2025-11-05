import { display_highlights } from "./highlights.mjs"
import { CAUSE, histoire } from "./histoire.mjs"
import { try_open_building } from "./panel/bldg_details.mjs"
import { panel } from "./panel/panel.mjs"
import { update_selected_map_features } from "./update_selected_feaures.mjs"
import { is_feature_selectable } from "./utils/does_feature_have_details.mjs"
import { create_element_from_Html } from "./utils/frontend_utils.mjs"
import * as svg_icons from './svg_icons.mjs'


export const handle_id_change = () => {

    update_selected_map_features()

    const { id } = histoire.entries[histoire.entries.length - 1]

    panel.must_expand = should_expand_panel(id, histoire.last_cause)


    if (typeof id === 'number'
        && is_feature_selectable(id)
    ) {
        try_open_building(id)
    } else if (id === 'menu') {
        // 1. links to other cities
        // 2. link to world map
        // 3. maybe, a link to google maps (if it's not shown outside the panel)
        // 4. maybe, a show user location button (if it's not shown outside the panel)
        // 5. ?? lists of highlights (if they don't belong to legend)
        // 6. about the map (pictograms, text)
        panel.set_content({
            element: create_element_from_Html(`<div id="panel-menu">
                <div id="osm-attr">
                    This map was built using <a target="_blank" href="https://openstreetmap.org/copyright">OpenStreetMap data</a>
                </div>
                <a data-href-id="about" href="#">About this map</a>
                <div id="gotogoogle">${svg_icons.gmaps}Open current map location in Google maps</div>
                <a data-href-id="highlights" href="#">${svg_icons.medal}Highlights</a>
                </div>`),
            id: 'menu'
        })
    } else if (id === 'about') {
        panel.set_content({
            element: create_element_from_Html(`<div>About (legend and textual summary)</div>`),
            id: 'about'
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
            id: 'intro'
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




/* 
    When panel must be expanded and when not:
    When app (any city) is opened for the first time, expand (most likely, with intro, but can be different, e.g. if someone follows a link to a building)
        'First time' is detected by whether panel was ever expanded
    When city is opened (initialized) again, expand/not according to what was last time
        (last time in any city?)
    When opening some content via pushState (something NEW is opened), always expand
    When opening due to back/forward,
        1) leave the panel expanded/collapsed if it's a navigation to a building
            (and therefore a user has a clue about what's going on, looking at the changing map, even if panel is closed)
        2) expand on any non-building content
           (otherwise, if panel is collapsed and not expanded, it will look as if nothing happened on B/F)

    This logic doesn't guarantee sensible behaviour when switching between cities; I haven't given much thought to it yet. But in general, I think nothing critical is going to happen
*/
const should_expand_panel = (id, cause) => {
    if (panel.was_never_expanded()) {
        return true
    }
    if (cause === CAUSE.INITIALIZE_CITY) { // secondary visit begins
        return localStorage.getItem('panel_was_expanded') !== 'false'
    }
    if (cause === CAUSE.PUSHSTATE) {
        return true
    }
    if (cause === CAUSE.POPSTATE) {
        return !is_feature_selectable(id)
    }

    return false // just in case
}
