import { centerOfMass } from 'https://esm.sh/@turf/center-of-mass@7.2.0'
import { midpoint } from 'https://esm.sh/@turf/midpoint@7.2.0'
import { polygonToLine } from 'https://esm.sh/@turf/polygon-to-line'
import { nearestPointOnLine } from 'https://esm.sh/@turf/nearest-point-on-line'
import { distance } from 'https://esm.sh/@turf/distance'

import { create_scale, update_scale } from './manage_scale.mjs'
import { add_mouse_stuff } from './mouse_stuff.mjs'
import { get_style } from './style.mjs'
import {
    get_id_from_current_url,
    get_center_for_bldg_with_offset,
    get_minimal_zoom_on_building_select,
    are_max_bounds_reached,
    get_root_html_attribute,
} from './utils/frontend_utils.mjs'

import { get_map_bounds_center, lnglat_is_within_bounds } from './utils/isomorphic_utils.mjs'
import { load_map_icons } from './load_map_icons.mjs'
import {
    DEV_skip_map_rendering,
    DEV_map_mock,
} from './DEV/constants.mjs'
import './photoswipe_mutations_observer.mjs'
import { adjust_panel_on_resize } from './panel/panel_resize.mjs'
import { is_feature_selectable } from './utils/does_feature_have_details.mjs'
import { current_city, load_city } from './load_city.mjs'
import { DEFAULT_MAX_ZOOM } from './constants.mjs'
import { throttled_update_flyto_button } from './panel/bldg_details_icons.mjs'
import { handle_id_change } from './handle_id_change.mjs'
import { histoire } from './histoire.mjs'
import { panel, update_panel_expand_button } from './panel/panel.mjs'

globalThis.turf = { // because the following turf functions are used on build too, and build can't import turf from https, imports it from node_modules instead
    centerOfMass,
    midpoint,
    polygonToLine,
    nearestPointOnLine,
    distance,
}

export const initialize_city = async (name) => {
    await load_city(name)

    let initial_center = JSON.parse(localStorage.getItem('map_center'))
    if (initial_center === null || !lnglat_is_within_bounds(initial_center, current_city.map_bounds)) {
        initial_center = get_map_bounds_center(current_city.map_bounds)

        // cached center and zoom clearly belonged to another city, therefore ->
        localStorage.removeItem('map_center')
        localStorage.removeItem('map_zoom')
    }

    const bldg_id_to_select = is_feature_selectable(get_id_from_current_url())
        ? get_id_from_current_url()
        : null

    const zoom = (bldg_id_to_select && get_minimal_zoom_on_building_select(bldg_id_to_select))
        || localStorage.getItem('map_zoom')
        || current_city.intro_zoom


    const map = window.dalatmap = DEV_skip_map_rendering
        ? DEV_map_mock
        : new maplibregl.Map({
            container: 'maplibregl-map',
            style: get_style(),
            zoom,
            dragRotate: false,
            keyboard: false, // also to prevent rotation
            maxBounds: [
                [current_city.map_bounds[0], current_city.map_bounds[1]],
                [current_city.map_bounds[2], current_city.map_bounds[3]]
            ],
            antialias: true,
            maxZoom: current_city.max_zoom || DEFAULT_MAX_ZOOM,
            // fadeDuration: 1000,
            pitchWithRotate: false,
            maxPitch: 0
        })

    map.touchZoomRotate.disableRotation()

    // preload_some_images()


    load_map_icons()



    // TODO 'idle' is used here in false expectation that it will allow to open panel only when map has finished drawing all tiles
    // This is half-cured by increasing the delay of 1st panel expand
    map.once('idle', async () => {

        histoire.initialize(handle_id_change)

        requestAnimationFrame(() => { // just in case
            // This is to reveal the button (remove its hidden class) in case panel is collapsed on pageload
            update_panel_expand_button()
        })

        if (panel.must_expand) {
            await new Promise(resolve => {
                panel.once('begin transition to new size', 'app', resolve)
            })
        }

        let center = initial_center

        if (bldg_id_to_select) {
            // get_center can return null, perhaps when centroid isn't generated yet,
            // It means some fuckup in the code but still it's better to show a sensible center
            center = get_center_for_bldg_with_offset(bldg_id_to_select) || initial_center
        }

        map.setCenter(center)

        add_mouse_stuff()

        requestAnimationFrame(
            () => document.querySelector('#maplibregl-map').classList.remove('hidden')
        )
    })

    map.on('move', () => {
        throttled_update_flyto_button()
    })

    map.on('wheel', e => {
        // this is a solution for:
        // "First n mousewheel forwards (intended to zoom in) get stolen,
        // if previously maxbounds were reached and mousewheel backwards continued for a while".
        // Solution is obtained by trial and error and I've no idea how it really works
        if (e.originalEvent.deltaY > 0 && get_root_html_attribute('min-zoom-reached')) {
            const prev_z = map.getZoom()
            requestAnimationFrame(() => { map.setZoom(prev_z) })
        }
    })

    map.on('zoom', onzoom)

    function onzoom() {
        document.documentElement.setAttribute('min-zoom-reached', are_max_bounds_reached())
        document.documentElement.setAttribute('max-zoom-reached', map.getZoom() === map.getMaxZoom())
        throttled_update_flyto_button()
        update_scale()
    }

    onzoom()

    const { adjust_scale_on_resize } = create_scale()

    const onresize = () => {
        map.once('idle', () => {
            onzoom()
            adjust_panel_on_resize()
            adjust_scale_on_resize()
        })
    }
    window.addEventListener('resize', onresize)
    window.addEventListener('orientationchange', onresize)

    map.on('moveend', () => {
        const { lng, lat } = map.getCenter()
        localStorage.setItem('map_center', JSON.stringify([lng, lat]))
        localStorage.setItem('map_zoom', map.getZoom())
    })

    if (location.hostname.endsWith('localhost')
        || /^[\d.]+$/.test(location.hostname) // in numeric host => ip address visited from mobile
    ) {
        const make_script = (src) => {
            const script = document.createElement('script')
            script.src = src
            script.async = true
            script.type = 'module'
            return script
        }

        document.body.appendChild(
            make_script('../js/DEV/handle_img_drag.mjs')
        )

        document.body.appendChild(
            make_script('../js/DEV/debug_el.mjs')
        )
    }

}
