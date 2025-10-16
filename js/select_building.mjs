import { layers_for_selected_feature } from "./common_drawing_layers/layers_for_selected_feature.mjs"
import { get_selected_building_id, set_selected_building_id } from "./selected_building_id.mjs"

// ###2
export const select_building = newid => {
    const sel_id = get_selected_building_id()
    if (newid !== sel_id) {

        layers_for_selected_feature.forEach(layer => {
            window.dalatmap.setFilter(layer.id, ['==', ["id"], +newid])
        })

        set_selected_building_id(newid)
    }
}
