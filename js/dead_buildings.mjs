import { FRENCH_DEAD_FILL_COLOR } from "./layers/constants.mjs"
import { SOURCES_NAMES } from "./sources.mjs"

export const dead_building_fill = {
    "id": "Dead building fill",
    "type": "fill",
    "source": SOURCES_NAMES.DALAT_TILES,
    "source-layer": "dead_buildings",
    "minzoom": 14,
    "paint": {
        "fill-color": FRENCH_DEAD_FILL_COLOR,
        "fill-antialias": true
    },
}

export const dead_building_skull = {
    id: 'Dead building skull',
    type: 'symbol',
    "source": SOURCES_NAMES.DALAT_TILES,
    "source-layer": "dead_buildings",
    "minzoom": 14,
    layout: {
        'icon-image': 'skull-icon',
        'icon-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            12, 0.005,
            18, 0.05
        ],
        'icon-allow-overlap': true
    },
}

export const add_dead_buildings = async () => {
    const image = await window.dalatmap.loadImage(`${window.location.origin}/dalat-map-images/skull.png`)
    window.dalatmap.addImage('skull-icon', image.data)
    window.dalatmap.addLayer(dead_building_fill)
    window.dalatmap.addLayer(dead_building_skull)
}