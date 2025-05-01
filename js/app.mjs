import { initialize_city } from './initialize_city.mjs'
import { cities_meta } from './cities_meta.mjs'
const current_city = new URL(location.href).pathname.split('/').filter(s => s.length > 0)[0]

if (current_city) {
    if (cities_meta[current_city]) {
        initialize_city(current_city)
    } else {
        console.warn(`First segment in pathname is not a city: ${current_city}, perhaps smth is wrong`)
    }
} else {
    document.write('will show world map')
}


// world map that switches btw cities:
// on select, remove center & coords from localStorage - or on unselect (zoomout)?