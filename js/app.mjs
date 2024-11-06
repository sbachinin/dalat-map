import { create_scale } from './manage_scale.mjs'
import { addMouseStuff } from './mouse_stuff.mjs'
import meta from './french_buildings_meta.mjs'
import { style } from './style.mjs'

const map = new maplibregl.Map({
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

map.addControl(new maplibregl.ScaleControl());
map.addControl(new maplibregl.NavigationControl(), 'top-right');

map.once('idle', () => {
    for (let frenchBuildingId of Object.keys(meta)) {
        map.setFeatureState(
            { source: 'dalat-tiles', sourceLayer: 'french_building', id: frenchBuildingId },
            { hasDetails: true }
        );
    }
})

create_scale()