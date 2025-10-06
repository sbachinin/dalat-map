import { SOURCES_NAMES } from "./constants.mjs"
import { get_selected_building_id, set_selected_building_id } from "./selected_building_id.mjs"

// ###2
export const select_building = newid => {
    const sel_id = get_selected_building_id()
    if (newid !== sel_id) {

        window.dalatmap.setFeatureState(
            {
                source: SOURCES_NAMES.CITY_TILES,
                sourceLayer: 'selectable_polygons',
                id: sel_id
            },
            { selected: false }
        )

        window.dalatmap.setFeatureState(
            {
                source: SOURCES_NAMES.CITY_TILES,
                sourceLayer: 'selectable_polygons',
                id: newid
            },
            { selected: true }
        )


        const cntrd = current_city.features_generated_props_for_frontend[newid]?.centroid
        window.dalatmap.getSource('selected_centroid_pin_point')
            .setData({
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: cntrd
                        },
                    }
                ]
            })


        set_selected_building_id(newid)
    }
}
