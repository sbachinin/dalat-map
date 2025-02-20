import { create_scale } from './manage_scale.mjs'
import { add_mouse_stuff } from './mouse_stuff.mjs'
import { style } from './style.mjs'
import { add_dead_buildings } from './dead_buildings.mjs'
import { display_highlights, preload_some_images } from './highlights.mjs'
import { try_open_building } from './bldg_details.mjs'
import { get_lnglat_per_px, get_map_center_shift } from './utils.mjs'
import { centroids_etc } from '../data/for_runtime/centroids_etc.mjs'
import { panel } from './panel/panel.mjs'
import '../data/static/DEV_get_updated_buildings_data.mjs'
import { handle_zoom_to_show_in_debug_el } from './DEV/debug_el.mjs'
import { initialize_tiny_squares } from './initialize_tiny_squares.mjs'

const initial_bldg_id = new URL(window.location.href).searchParams.get('id')

const DEV_should_open_panel = true

const zoom = (initial_bldg_id !== null && 15.5)
    || localStorage.getItem('map_zoom')
    || 0

const map = window.dalatmap = new maplibregl.Map({
    container: 'map',
    style,
    zoom,
    dragRotate: false,
    keyboard: false, // also to prevent rotation
    maxBounds: [
        [108.37416, 11.88], // SW
        [108.52, 12.01]  // NE
    ],
    antialias: true,
    maxZoom: 17.5,
    fadeDuration: 0
})

map.touchZoomRotate.disableRotation()

preload_some_images()

add_mouse_stuff()

map.addControl(
    new maplibregl.NavigationControl({ showCompass: false, showZoom: true }),
    'top-right'
)

map.once('idle', () => {

})

initialize_tiny_squares()


map.on('load', async () => {
    add_dead_buildings(map)

    if (DEV_should_open_panel) {
        if (initial_bldg_id !== null) {
            try_open_building(initial_bldg_id, false, false)
        } else {
            display_highlights()
        }
    }

    await panel.full_size_promise

    let center = JSON.parse(localStorage.getItem('map_center')) || [0, 0]
    if (initial_bldg_id !== null) {
        const cntrd = centroids_etc[initial_bldg_id]?.centroid
        if (!cntrd) {
            console.warn(`no centroid for ${initial_bldg_id}`)
            return
        }
        const { lng_per_px, lat_per_px } = get_lnglat_per_px()
        const center_x = cntrd[0] - lng_per_px * get_map_center_shift()[0]
        const center_y = cntrd[1] - lat_per_px * get_map_center_shift()[1]
        center = [center_x, center_y]
    }

    map.setCenter(center)

    document.querySelector('#map').classList.remove('hidden')
})

handle_zoom_to_show_in_debug_el()

map.on('move', () => {
    if (window.innerWidth < 768) {
        document.querySelector(`#custom-attribution details`).removeAttribute('open')
    }
})


create_scale()

if (window.location.hostname === 'localhost') {
    const script = document.createElement('script')
    script.src = 'js/DEV/handle_img_drag.mjs'
    script.async = true
    document.body.appendChild(script)
}

window.addEventListener("popstate", (event) => {
    if (event.state?.id) {
        try_open_building(event.state.id, false, true)
    } else {
        display_highlights(false)
    }
})

map.on('moveend', () => {
    const { lng, lat } = map.getCenter()
    localStorage.setItem('map_center', JSON.stringify([lng, lat]))
    localStorage.setItem('map_zoom', map.getZoom())
})
