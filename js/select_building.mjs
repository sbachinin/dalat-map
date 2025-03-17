import { SOURCES_NAMES } from "./sources.mjs"

export let selected_building_id = null

export const set_selected_feature_state = newid => {
    const oldid = selected_building_id
    selected_building_id = newid
    if (oldid) {
        window.dalatmap.setFeatureState(
            { source: SOURCES_NAMES.DALAT_TILES, sourceLayer: 'french_building', id: oldid },
            { selected: false }
        )
        window.dalatmap.setFeatureState(
            { source: SOURCES_NAMES.BUILDING_TITLE, id: oldid },
            { selected: false }
        )
    }
    if (newid) {
        window.dalatmap.setFeatureState(
            { source: SOURCES_NAMES.DALAT_TILES, sourceLayer: 'french_building', id: newid },
            { selected: true }
        )
        window.dalatmap.setFeatureState(
            { source: SOURCES_NAMES.BUILDING_TITLE, id: newid },
            { selected: true }
        )
    }
}

export const get_link_to_selected_bldg = () => {
    return window.location.origin + `/?id=` + selected_building_id
}