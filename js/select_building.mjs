import { french_buildings_titles } from "./drawing_layers.mjs"
import { FRENCH_SELECTED_FILL_COLOR, FRENCH_SELECTED_TITLE_HALO_COLOR } from "./layers/constants.mjs"
import { french_fill_common_props } from "./layers/french_polygons.mjs"
import { get_selected_building_id, set_selected_building_id } from "./selected_building_id.mjs"
import { is_french_building } from "./utils/isomorphic_utils.mjs"
import { deep_merge_objects } from "./utils/utils.mjs"

const SELECTED_STYLE_LAYER_PREFIX = 'Selected::'

export const select_building = newid => {
    if (newid !== get_selected_building_id()) {
        set_selected_building_id(newid)

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
                            // bldg id is appended in order to prevent blinking of previously selected building
                            // (this occured if old bldg was unselected first)
                            // Appending bldg id fixes it, perhaps because maplibre stops trying to "revive" the old selected layer
                            id: SELECTED_STYLE_LAYER_PREFIX + french_buildings_titles.name + newid,
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
                            id: SELECTED_STYLE_LAYER_PREFIX + 'French bldg fill' + newid,
                            "paint": {
                                "fill-color": FRENCH_SELECTED_FILL_COLOR
                            },
                            filter
                        }
                    )
                )
                // TODO: can also add layer "selected square at low zoom"
        }

    }

}

export const get_link_to_selected_bldg = () => {
    return window.location.origin + window.location.pathname + `?id=` + get_selected_building_id()
}