export const map_bounds = [107.4249, 16.3237, 107.7469, 16.6037]

export const roads_config = {
    secondary: 12.3,
    tertiary: 13.4,
    unclassified: 14.5
}

export const is_building_historic = f => f.properties?.['building:architecture'] === 'french_colonial'