let selected_building_id = null
export const set_selected_building_id = newid => {
    if (typeof newid !== 'number') throw new Error('newid must be a number')
    selected_building_id = newid
}

export const get_selected_building_id = () => selected_building_id