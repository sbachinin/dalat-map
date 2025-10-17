import { layers_for_selected_feature } from "./common_drawing_layers/layers_for_selected_feature.mjs"
import { get_selected_building_id, set_selected_building_id } from "./selected_building_id.mjs"

// ###2
export const select_building = (new_id) => {
    const sel_id = get_selected_building_id()
    if (new_id !== sel_id) {

        // If no building is selected, hide the pin right away
        // If a building is selected, do nothing about a pin within this function
            // because switching the pin must be delayed until the end of flight to new building, and is done elsewhere
        if (new_id === null) {
            window.dalatmap.setFilter('Selected feature pin', ['==', ["id"], null])
        }

        layers_for_selected_feature
            .filter(layer => layer.id !== 'Selected feature pin') // name to a const
            .forEach(layer => window.dalatmap.setFilter(layer.id, ['==', ["id"], new_id]))

        set_selected_building_id(new_id)
    }
}
