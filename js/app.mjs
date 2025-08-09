import { initialize_city } from './initialize_city.mjs'
import { get_cityname_from_url } from './utils/frontend_utils.mjs'

const current_city = get_cityname_from_url(location.href)

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