import { FIRST_CLASS_FRENCH_MINZOOM } from "../js/common_drawing_layers/constants.mjs"


// 10 is supposed to be a "global default" for now
// So this is just to demonstrate that city can order another minzoom
// That will affect e.g. the minzoom for tile generation
// export const minzoom = 10

export const map_bounds = [108.3378, 11.8540, 108.5587, 12.0360]

export const intro_zoom = FIRST_CLASS_FRENCH_MINZOOM

export const city_title_coords = [108.442055, 11.951744]

export const roads_config = {
    secondary: 12.2
}

export const is_building_historic = f => f.properties?.['building:architecture'] === 'french_colonial'