import { FIRST_CLASS_FRENCH_MINZOOM } from "./layers/constants.mjs";

export const cities_meta = {
    dalat: {
        bounds: [108.3765, 11.8800, 108.5200, 12.0100],
        html_title: 'Map of colonial architecture in Dalat',
        intro_zoom: FIRST_CLASS_FRENCH_MINZOOM,
    },
    hue: {
        bounds: [107.5409, 16.4137, 107.6409, 16.5137], // given by ai
        html_title: 'Map of colonial architecture in Hue',
    }
}

export const load_city = async (name) => {
    current_city = {}
    current_city.bounds = cities_meta[name].bounds
    current_city.intro_zoom = cities_meta[name].intro_zoom || 12

    const [hmd] = await Promise.all([
        import(`../${name}/handmade_data.mjs`)
    ])
    current_city.all_handmade_data = hmd.all_handmade_data
}

export let current_city = null