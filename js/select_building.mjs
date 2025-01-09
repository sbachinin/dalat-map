let selectedBuildingId = null

export const select_bldg = newid => {
    const oldid = selectedBuildingId
    selectedBuildingId = newid
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