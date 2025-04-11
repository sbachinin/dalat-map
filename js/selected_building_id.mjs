let selected_building_id = null
export const set_selected_building_id = newid => {
    if (typeof newid !== 'number' && newid !== null) throw new Error('newid must be a number or null')
    selected_building_id = newid
}

export const get_selected_building_id = () => selected_building_id