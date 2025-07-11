import { initialize_city } from './initialize_city.mjs'

const pathname_parts = new URL(location.href).pathname.split('/').filter(s => s.length > 0)
const current_city = pathname_parts[pathname_parts.length - 1]

if (current_city) {
    const res = await fetch(`../${current_city}/isomorphic_assets.mjs`) // check if such city exists
    if (res.ok) {
        initialize_city(current_city)
    } else {
        console.warn(`First segment in pathname is not a valid city name: ${current_city}, perhaps smth is wrong`)
    }
} else {
    document.write('will show world map')
}


// world map that switches btw cities:
// on select, remove center & coords from localStorage - or on unselect (zoomout)?