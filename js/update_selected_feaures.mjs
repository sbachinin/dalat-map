import { layers_for_selected_feature, pin_style_layer_id } from "./common_drawing_layers/layers_for_selected_feature.mjs"
import { SOURCES_NAMES, TTTLES_MAIN_TILE_LAYER } from "./constants.mjs"
import { get_bldg_id_from_url } from "./utils/frontend_utils.mjs"

// ###2
export const update_selected_features = (new_id) => { // update_selected_style
    const curr_id = get_bldg_id_from_url(window.location.href)

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
        { source: SOURCES_NAMES.CITY_TILES, sourceLayer: TTTLES_MAIN_TILE_LAYER, id: curr_id },
        { selected: false }
    )
    window.dalatmap.setFeatureState(
        { source: SOURCES_NAMES.CITY_TILES, sourceLayer: TTTLES_MAIN_TILE_LAYER, id: new_id },
        { selected: true }
    )
}
