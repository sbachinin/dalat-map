import { create_scale } from './manage_scale.mjs'
import { try_open_building, addMouseStuff } from './mouse_stuff.mjs'
import meta from './french_buildings_meta.mjs'
import { style } from './style.mjs'
import { add_dead_buildings } from './dead_buildings.mjs'
import { display_highlights, preload_some_images } from './highlights.mjs'

const map = window.map = new maplibregl.Map({
    container: 'map',
    style,
    hash: true,
    center: [108.44409, 11.945],
    zoom: 0,
    maxBounds: [
        [108.37416, 11.88], // SW
        [108.52, 12.01]  // NE
    ],
    antialias: true,
    maxZoom: 17.5
});

preload_some_images()

addMouseStuff(map)

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

map.on('load', () => {
    const attribution = document.querySelector(`details.maplibregl-ctrl-attrib`).outerHTML;
    const attributionElement = document.getElementById('custom-attribution');
    attributionElement.innerHTML = attribution;
    add_dead_buildings(map)

    setTimeout(() => {
        const url = new URL(window.location.href)
        const id = url.searchParams.get('id')
        if (id !== null) {
            try_open_building(id, true)
        } else {
            display_highlights()
        }
    }, 1000)
});

map.on('move', () => {
    if (window.innerWidth < 768) {
        document.querySelector(`#custom-attribution details`).removeAttribute('open')
    }
})


create_scale()

if (window.location.hostname === 'localhost') {
    const script = document.createElement('script')
    script.src = 'js/DEV_handle_img_drag.mjs'
    document.body.appendChild(script)
}