import { create_scale } from './manage_scale.mjs'
import { addMouseStuff } from './mouse_stuff.mjs'
import meta from '../data/static/buildings_handmade_data.mjs'
import { style } from './style.mjs'
import { add_dead_buildings } from './dead_buildings.mjs'
import { display_highlights, preload_some_images } from './highlights.mjs'
import { try_open_building } from './bldg_details.mjs'
import { create_element_from_Html, get_lnglat_per_px, get_map_center_shift } from './utils.mjs'
import { centroids } from '../data/centroids.mjs'
import { panel } from './panel/panel.mjs'


const initial_bldg_id = new URL(window.location.href).searchParams.get('id')

// Return [lng, lat] or null
const get_center_for_building = (id) => {
    const cntrd = centroids[id]
    if (!cntrd) return null


    // nonsense, this shift has to be translated to lng lat first
    const cntr_shift = get_map_center_shift()
    return [
        cntrd[0] + cntr_shift[0],
        cntrd[1] + cntr_shift[1]
    ]
}

const center = get_center_for_building(initial_bldg_id)
    || JSON.parse(localStorage.getItem('map_center'))
    || [0, 0]

const zoom = (initial_bldg_id !== null && 15.5)
    || localStorage.getItem('map_zoom')
    || 0

const map = window.dalatmap = new maplibregl.Map({
    container: 'map',
    style,
    center,
    zoom,
    maxBounds: [
        [108.37416, 11.88], // SW
        [108.52, 12.01]  // NE
    ],
    antialias: true,
    maxZoom: 17.5
});

preload_some_images()

addMouseStuff()

map.addControl(new maplibregl.NavigationControl(), 'top-right');

map.once('idle', () => {

    Object.entries(meta)
        .forEach(([bldg_id, bldg_meta]) => {
            map.setFeatureState(
                { source: 'dalat-tiles', sourceLayer: 'french_building', id: bldg_id },
                { hasDetails: bldg_meta.images?.length > 0 }
            )
        })
})

map.on('load', async () => {
    add_dead_buildings(map)

    if (initial_bldg_id !== null) {
        try_open_building(initial_bldg_id, false, false)
    } else {
        display_highlights()
    }

    await panel.full_size_promise

    const { lng_per_px, lat_per_px } = get_lnglat_per_px()
    dalatmap.setCenter([
        dalatmap.getCenter().lng - lng_per_px * get_map_center_shift()[0],
        dalatmap.getCenter().lat - lat_per_px * get_map_center_shift()[1],
    ])

    document.querySelector('#map').classList.remove('hidden')
})

map.on('move', () => {
    if (window.innerWidth < 768) {
        document.querySelector(`#custom-attribution details`).removeAttribute('open')
    }
})


create_scale()

if (window.location.hostname === 'localhost') {
    const script = create_element_from_Html(
        `<script src="js/DEV_handle_img_drag.mjs"></script>`)
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
