import { get_selected_building_id, set_selected_building_id } from "./selected_building_id.mjs"

export const SELECTED_STYLE_LAYER_PREFIX = 'Selected::'

export const select_building = newid => {
    if (newid !== get_selected_building_id()) {
        set_selected_building_id(newid)
        for (const layer of window.dalatmap.getStyle().layers) {
            if (layer.id.startsWith(SELECTED_STYLE_LAYER_PREFIX)) {
                const filter = [...layer.filter]
                    .map(f_item => { // find an "id" filter and set its target value to selected_building_id
                        if (f_item[0] === '==' && f_item[1][0] === 'id') {
                            return [
                                f_item[0], 
                                f_item[1], 
                                newid === null ? 'nonexistent_id' : newid // for clarity
                            ]
                        } else return f_item
                    })
                window.dalatmap.setFilter(layer.id, filter)
            }
        }
    }
}

export const get_link_to_selected_bldg = () => {
    return window.location.origin + window.location.pathname + `?id=` + get_selected_building_id()
}