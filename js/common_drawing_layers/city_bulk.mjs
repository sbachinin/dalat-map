import * as c from "./constants.mjs"
import { SOURCES_NAMES } from "../sources.mjs"

export const city_bulk_fill = {
    id: 'cityBulk',
    type: 'fill',
    source: SOURCES_NAMES.CITY_TILES,
    "source-layer": 'city_bulk_geometry',
    filter: ['==', ['geometry-type'], 'Polygon'],
    minzoom: 10,
    paint: {
        'fill-color': c.CITY_BULK_FULL_COLOR,
        'fill-antialias': true,
        "fill-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            c.CITY_BULK_FULL_OPACITY_MAXZOOM,
            1,
            c.CITY_BULK_DISAPPEARANCE_ZOOM,
            0
        ]
    },
}

export const city_bulk_border = {
    name: 'cityBulk border',
    type: 'line',
    source: SOURCES_NAMES.CITY_TILES,
    "source-layer": 'city_bulk_geometry',
    filter: ['==', ['geometry-type'], 'Polygon'],
    paint: {
        'line-color': [
            "interpolate",
            ["linear"],
            ["zoom"],
            c.CITY_BULK_FULL_OPACITY_MAXZOOM,
            'black',
            c.CITY_BULK_DISAPPEARANCE_ZOOM,
            'hsl(259, 25%, 50%)'
        ],
        'line-width': [
            "interpolate",
            ["linear"],
            ["zoom"],
            c.CITY_BULK_FULL_OPACITY_MAXZOOM,
            1.5,
            18,
            12
        ],
        "line-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            c.CITY_BULK_FULL_OPACITY_MAXZOOM,
            1,
            c.CITY_BULK_DISAPPEARANCE_ZOOM + 1,
            0.35,
            c.CITY_BULK_DISAPPEARANCE_ZOOM + 2,
            0.2
        ]
    }
}
