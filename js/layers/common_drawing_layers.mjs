import * as c from "./constants.mjs"
import { SOURCES_NAMES } from "../sources.mjs"
import { BRIGHT_LAKE_COLOR, PALE_LAKE_COLOR } from "./constants.mjs";


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


export const city_title = {
    "name": "City title",
    "type": "symbol",
    source: SOURCES_NAMES.CITY_TITLE,
    layout: {
        "text-field": ["get", "title"],
        'text-size': 20,
        'text-font': ['Lato Regular'],
    },
    paint: {
        "text-halo-color": "hsl(0, 0%, 100%)",
        "text-halo-width": 10,
        "text-halo-blur": 0
    }
}


export const river_lines = {
    name: 'River lines',
    type: 'line',
    minzoom: 12,
    source: SOURCES_NAMES.CITY_TILES,
    'source-layer': 'river_lines',
    "layout": {
        "visibility": "visible",
        "line-cap": "round",
        "line-join": "round",
    },
    "paint": {
        "line-color": [
            "interpolate",
            ["linear", 2],
            ["zoom"],
            10, BRIGHT_LAKE_COLOR,
            13.7, PALE_LAKE_COLOR,
        ],
        'line-width': [
            "interpolate",
            ["linear"],
            ["zoom"],
            12,
            1.2,
            14,
            2,
            18,
            6
        ]
    },
}
