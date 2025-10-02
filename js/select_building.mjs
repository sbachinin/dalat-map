import { current_city } from "./load_city.mjs"
import { get_selected_building_id, set_selected_building_id } from "./selected_building_id.mjs"

export const select_building = newid => {
    const sel_id = get_selected_building_id()
    if (newid !== sel_id) {

        const source = window.dalatmap.getSource('selected-building')

        const data = {
            type: 'FeatureCollection',
            features: []
        }
        if (newid) {
            data.features = [{
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: current_city.contentful_buildings_props_from_osm[newid].polygon
                },
                properties: { name: 'Hanoi' }
            }]
        }

        source.setData(data)

        set_selected_building_id(newid)
    }
}
