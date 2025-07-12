import { get_selected_building_id, set_selected_building_id } from "./selected_building_id.mjs"

export const SELECTED_STYLE_LAYER_PREFIX = 'Selected::'

export const select_building = newid => {
    if (newid !== get_selected_building_id()) {
        set_selected_building_id(newid)
        for (const layer of window.dalatmap.getStyle().layers) {
            if (layer.id.startsWith(SELECTED_STYLE_LAYER_PREFIX)) {
                const new_filter_id = newid === null ? 'nonexistent_id' : newid

                if (layer.filter.includes('all')) { // filter is "composite"
                    window.dalatmap.setFilter(
                        layer.id,
                        layer.filter.map(f => {
                            if (f[0] === '==' && f[1][0] === 'id') { // is "id subfilter"
                                return ['==', ['id'], new_filter_id]
                            }
                            return f
                        })
                    )
                } else {
                    window.dalatmap.setFilter(layer.id, ['==', ['id'], new_filter_id])
                }

            }
        }
    }
}

export const get_link_to_selected_bldg = () => {
    return window.location.origin + window.location.pathname + `?id=` + get_selected_building_id()
}