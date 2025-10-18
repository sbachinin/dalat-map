// 10 is supposed to be a "global default" for now
// So this is just to demonstrate that city can order another minzoom
// That will affect e.g. the minzoom for tile generation
// export const minzoom = 10

export const map_bounds = [102.1503958,  2.094407, 102.335, 2.291455]

export const intro_zoom = 12.8

export const max_zoom = 18

export const city_title_coords = [102.252908, 2.214269]

export const roads_config = {}

export const is_building_historic = f => !!f.properties?.historic