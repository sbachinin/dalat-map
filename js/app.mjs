import { create_scale } from './manage_scale.mjs'
import { addMouseStuff } from './mouse_stuff.mjs'
import meta from './french_buildings_meta.mjs'
import { style } from './style.mjs'
import { panel } from './panel.mjs'
import { display_highlights } from './highlights.mjs'

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
    maxZoom: 17
});

addMouseStuff(map)

map.addControl(new maplibregl.NavigationControl(), 'top-right');

map.once('idle', () => {
    for (let frenchBuildingId of Object.keys(meta)) {
        map.setFeatureState(
            { source: 'dalat-tiles', sourceLayer: 'french_building', id: frenchBuildingId },
            { hasDetails: true }
        );
    }
})

map.on('load', () => {
    const attribution = document.querySelector(`details.maplibregl-ctrl-attrib`).outerHTML;
    const attributionElement = document.getElementById('custom-attribution');
    attributionElement.innerHTML = attribution;
    document.querySelector('.maplibregl-canvas-container').addEventListener('click', function (event) {
        panel.collapse()
    });
    setTimeout(display_highlights, 1000)
});

map.on('move', () => {
    if (window.innerWidth < 768) {
        document.querySelector(`#custom-attribution details`).removeAttribute('open')
    }
})


create_scale()