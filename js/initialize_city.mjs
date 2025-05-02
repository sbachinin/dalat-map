import { create_scale, update_scale } from './manage_scale.mjs'
import { add_mouse_stuff } from './mouse_stuff.mjs'
import { style } from './style.mjs'
import { add_dead_buildings } from './dead_buildings.mjs'
import { display_highlights, /* preload_some_images */ } from './highlights.mjs'
import { try_open_building, update_flyto_button } from './bldg_details.mjs'
import {
    get_bldg_id_from_url,
    get_center_for_bldg_with_offset,
    get_map_bounds_center,
    lnglat_is_within_bounds
} from './utils/utils.mjs'
import { panel } from './panel/panel.mjs'
import '../data/static/DEV_get_updated_buildings_data.mjs'
import { handle_zoom_to_show_in_debug_el } from './DEV/debug_el.mjs'
import { load_icons } from './load_icons.mjs'
import {
    DEV_skip_map_rendering,
    DEV_map_mock,
    DEV_show_debug_el
} from './DEV/constants.mjs'
import './photoswipe_mutations_observer.mjs'
import { update_zoom_buttons } from './custom_zoom_buttons.mjs'
import { adjust_panel_on_resize } from './panel/panel_resize.mjs'
import { initialize_highlights_button } from './panel/highlights_button.mjs'
import { FIRST_CLASS_FRENCH_MINZOOM, MINIMAL_ZOOM_ON_BUILDING_SELECT } from './layers/constants.mjs'
import { initialize_panel } from './initialize_panel.mjs'
import { is_feature_selectable } from './utils/does_feature_have_details.mjs'
import { cities_meta } from './cities_meta.mjs'

export const initialize_city = (city) => {
    let initial_center = JSON.parse(localStorage.getItem('map_center')) // [lng, lat]
    if (initial_center === null || !lnglat_is_within_bounds(initial_center, cities_meta[city].bounds)) {
        initial_center = get_map_bounds_center(cities_meta[city].bounds)
    }

    if (get_bldg_id_from_url() && !is_feature_selectable(get_bldg_id_from_url())) {
        console.warn(`"id" parameter in the URL is not a selectable building id`)
    }

    const zoom = (is_feature_selectable(get_bldg_id_from_url()) && MINIMAL_ZOOM_ON_BUILDING_SELECT)
        || localStorage.getItem('map_zoom')
        || FIRST_CLASS_FRENCH_MINZOOM


    const map = window.dalatmap = DEV_skip_map_rendering
        ? DEV_map_mock
        : new maplibregl.Map({
            container: 'maplibregl-map',
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
            fadeDuration: 0,
            pitchWithRotate: false,
            maxPitch: 0
        })

    map.touchZoomRotate.disableRotation()

    // preload_some_images()


    load_icons()



    // TODO 'idle' is used here in false expectation that it will allow to open panel only when map has finished drawing all tiles
    // This is half-cured by increasing the delay of 1st panel expand
    map.once('idle', async () => {
        await initialize_panel()

        initialize_highlights_button(panel.content?.type)

        const center = is_feature_selectable(get_bldg_id_from_url())
            ? get_center_for_bldg_with_offset(get_bldg_id_from_url())
            : initial_center

        map.setCenter(center)

        add_mouse_stuff()
        add_dead_buildings(map)

        requestAnimationFrame(
            () => document.querySelector('#maplibregl-map').classList.remove('hidden')
        )
    })

    if (DEV_show_debug_el) {
        handle_zoom_to_show_in_debug_el()
    }

    map.on('move', () => {
        update_flyto_button()

        if (window.innerWidth < 768) {
            document.querySelector(`#custom-attribution details`).removeAttribute('open')
        }
    })

    map.on('zoom', () => {
        update_flyto_button()
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
        script.src = '../js/DEV/handle_img_drag.mjs'
        script.async = true
        document.body.appendChild(script)
    }

    window.addEventListener("popstate", (event) => {
        if (is_feature_selectable(event.state?.id)) {
            try_open_building(event.state.id, false, true, false)
        } else {
            display_highlights(false)
        }
    })

    map.on('moveend', () => {
        const { lng, lat } = map.getCenter()
        localStorage.setItem('map_center', JSON.stringify([lng, lat]))
        localStorage.setItem('map_zoom', map.getZoom())
    })
}
