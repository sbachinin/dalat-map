import { layers_for_selected_feature, pin_style_layer_id } from "./common_drawing_layers/layers_for_selected_feature.mjs"
import { SOURCES_NAMES, TITLES_MAIN_TILE_LAYER } from "./constants.mjs"
import { histoire } from "./histoire.mjs"
import { get_id_from_current_url } from "./utils/frontend_utils.mjs"

// ###2
export const update_selected_map_features = () => {
    const prev_id = histoire.entries[histoire.entries.length - 2]?.id
    const next_id = get_id_from_current_url()

    // If no building is selected, hide the pin right away
    // If a building is selected, do nothing about a pin within this function
    // because switching the pin must be delayed until the end of flight to new building, and is done elsewhere
    if (next_id === null) {
        window.dalatmap.setFilter(pin_style_layer_id, ['==', ["id"], null])
    }

    layers_for_selected_feature
        .filter(layer => layer.id !== pin_style_layer_id) // name to a const
        .forEach(layer => window.dalatmap.setFilter(layer.id, ['==', ["id"], next_id]))



    prev_id && window.dalatmap.setFeatureState(
        { source: SOURCES_NAMES.CITY_TILES, sourceLayer: TITLES_MAIN_TILE_LAYER, id: prev_id },
        { selected: false }
    )
    window.dalatmap.setFeatureState(
        { source: SOURCES_NAMES.CITY_TILES, sourceLayer: TITLES_MAIN_TILE_LAYER, id: next_id },
        { selected: true }
    )
}
    