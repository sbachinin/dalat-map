import { layers_for_selected_feature, pin_style_layer_id } from "./common_drawing_layers/layers_for_selected_feature.mjs"
import { SOURCES_NAMES } from "./constants.mjs"
import { get_selected_building_id, set_selected_building_id } from "./selected_building_id.mjs"

// ###2
export const select_building = (new_id) => {
    const sel_id = get_selected_building_id()
    if (new_id !== sel_id) {

        // If no building is selected, hide the pin right away
        // If a building is selected, do nothing about a pin within this function
        // because switching the pin must be delayed until the end of flight to new building, and is done elsewhere
        if (new_id === null) {
            window.dalatmap.setFilter(pin_style_layer_id, ['==', ["id"], null])
        }

        layers_for_selected_feature
            .filter(layer => layer.id !== pin_style_layer_id) // name to a const
            .forEach(layer => window.dalatmap.setFilter(layer.id, ['==', ["id"], new_id]))



        window.dalatmap.setFeatureState(
            { source: SOURCES_NAMES.CITY_TILES, sourceLayer: 'polygons_titles_points', id: sel_id },
            { selected: false }
        )
        window.dalatmap.setFeatureState(
            { source: SOURCES_NAMES.CITY_TILES, sourceLayer: 'polygons_titles_points', id: new_id },
            { selected: true }
        )

        set_selected_building_id(new_id)
    }
}
