import { create_scale, update_scale } from './manage_scale.mjs'
import { add_mouse_stuff } from './mouse_stuff.mjs'
import { style } from './style.mjs'
import { add_dead_buildings } from './dead_buildings.mjs'
import { display_highlights, /* preload_some_images */ } from './highlights.mjs'
import { try_open_building } from './bldg_details.mjs'
import { get_center_for_bldg_with_offset } from './utils.mjs'
import { panel } from './panel/panel.mjs'
import '../data/static/DEV_get_updated_buildings_data.mjs'
import { handle_zoom_to_show_in_debug_el } from './DEV/debug_el.mjs'
import { initialize_tiny_squares } from './initialize_tiny_squares.mjs'
import { DEV_skip_map_rendering, DEV_should_open_panel, DEV_map_mock, DEV_show_debug_el } from './DEV/constants.mjs'
import './photoswipe_mutations_observer.mjs'
import { update_zoom_buttons } from './custom_zoom_buttons.mjs'
import { adjust_panel_on_resize } from './panel/panel_resize.mjs'
import { initialize_highlights_button } from './panel/highlights_button.mjs'

const initial_bldg_id = new URL(window.location.href).searchParams.get('id')
const saved_center = JSON.parse(localStorage.getItem('map_center')) || [0, 0]

const zoom = (initial_bldg_id !== null && 15.5)
    || localStorage.getItem('map_zoom')
    || 0


const map = window.dalatmap = DEV_skip_map_rendering
    ? DEV_map_mock
    : new maplibregl.Map({
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

// preload_some_images()


initialize_tiny_squares()


map.once('idle', async () => {
    panel.once('new breadth was set', 'app', () => {
        initialize_highlights_button(panel.content.type)

        const center = initial_bldg_id === null
            ? saved_center
            : get_center_for_bldg_with_offset(initial_bldg_id)

        map.setCenter(center)
        document.querySelector('#map').classList.remove('hidden')
    })

    if (DEV_should_open_panel) {
        const merriweather = new FontFaceObserver('Merriweather', { weight: 'normal', style: 'italic' })
        await merriweather.load()
        if (initial_bldg_id !== null) {
            try_open_building(initial_bldg_id, false, false)
        } else {
            display_highlights()
        }
    }

    add_mouse_stuff()
    add_dead_buildings(map)
})

if (DEV_show_debug_el) {
    handle_zoom_to_show_in_debug_el()
}

map.on('move', () => {
    if (window.innerWidth < 768) {
        document.querySelector(`#custom-attribution details`).removeAttribute('open')
    }
})

map.on('zoom', () => {
    update_scale()
    update_zoom_buttons()
})

const { adjust_scale_on_resize } = create_scale()

const onresize = () => {
    adjust_panel_on_resize()
    adjust_scale_on_resize()
    update_zoom_buttons()
}
window.addEventListener('resize', onresize)
window.addEventListener('orientationchange', onresize)


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
