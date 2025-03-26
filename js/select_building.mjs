import { FRENCH_SELECTED_FILL_COLOR, FRENCH_SELECTED_TITLE_HALO_COLOR } from "./layers/constants.mjs"
import { french_fill_common_props } from "./layers/french_polygons.mjs"
import { french_buildings_titles } from "./layers/titles.mjs"
import { is_french_building } from "./utils/isomorphic_utils.mjs"
import { deep_merge_objects } from "./utils/utils.mjs"

const SELECTED_STYLE_LAYER_PREFIX = 'Selected::'

export let selected_building_id = null

export const select_building = newid => {
    if (newid !== selected_building_id) {
        selected_building_id = newid

        for (const layer of window.dalatmap.getStyle().layers) {
            if (layer.id.startsWith(SELECTED_STYLE_LAYER_PREFIX)) {
                window.dalatmap.removeLayer(layer.id)
            }
        }

        const filter = ["==", ["id"], Number(newid)]

        if (is_french_building(newid)) {
            dalatmap.addLayer(
                deep_merge_objects(
                    french_buildings_titles,
                    {
                        id: SELECTED_STYLE_LAYER_PREFIX + 'French bldg title',
                        paint: {
                            "text-halo-color": FRENCH_SELECTED_TITLE_HALO_COLOR,
                            "text-halo-width": 5,
                            "text-halo-blur": 0
                        },
                        filter
                    }
                )
            )
            dalatmap.addLayer(
                deep_merge_objects(
                    french_fill_common_props,
                    {
                        id: SELECTED_STYLE_LAYER_PREFIX + 'French bldg fill',
                        "paint": {
                            "fill-color": FRENCH_SELECTED_FILL_COLOR
                        },
                        filter
                    }
                )
            )
        }
    }

}

export const get_link_to_selected_bldg = () => {
    return window.location.origin + window.location.pathname + `?id=` + selected_building_id
}