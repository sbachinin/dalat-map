export let selected_building_id = null

export const select_bldg = newid => {
    const oldid = selected_building_id
    selected_building_id = newid
    if (oldid) {
        window.dalatmap.setFeatureState(
            { source: 'dalat-tiles', sourceLayer: 'french_building', id: oldid },
            { selected: false }
        )
    }
    if (newid) {
        window.dalatmap.setFeatureState(
            { source: 'dalat-tiles', sourceLayer: 'french_building', id: newid },
            { selected: true }
        )
    }
}