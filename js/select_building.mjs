import { current_city } from "./load_city.mjs"
import { get_selected_building_id, set_selected_building_id } from "./selected_building_id.mjs"

export const select_building = newid => {
    const sel_id = get_selected_building_id()
    if (newid !== sel_id) {

        current_city.sources_of_selectable_features.forEach(({ source, sourceLayer }) => {
            window.dalatmap.setFeatureState({
                source,
                sourceLayer,
                id: newid
            }, { selected: true })

            sel_id && window.dalatmap.removeFeatureState({
                source,
                sourceLayer,
                id: sel_id
            }, 'selected')
        })

        set_selected_building_id(newid)
    }
}
