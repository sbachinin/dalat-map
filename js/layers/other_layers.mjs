import * as c from "./constants.mjs"
import { SOURCES_NAMES } from "../sources.mjs"

export const city_bulk_fill = {
    id: 'cityBulk',
    type: 'fill',
    source: SOURCES_NAMES.DALAT_TILES,
    "source-layer": 'dalat_bulk_geometry',
    minzoom: 10,
    maxzoom: 14.3,
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
    }
}

export const city_bulk_border = {
    id: 'cityBulk border',
    type: 'line',
    source: SOURCES_NAMES.DALAT_TILES,
    "source-layer": 'dalat_bulk_geometry',
    paint: {
        'line-color': [
            "interpolate",
            ["linear"],
            ["zoom"],
            c.CITY_BULK_FULL_OPACITY_MAXZOOM,
            c.CITY_BULK_FULL_COLOR,
            13.475,
            '#FAEFEB'
        ],
        'line-width': 10
    }
}



export const boring_building_fill = {
    "id": "Boring building fill",
    "type": "fill",
    "source": SOURCES_NAMES.DALAT_TILES,
    "source-layer": "boring_building",
    "minzoom": c.BORING_BLDGS_MINZOOM,
    "paint": {
        "fill-color": [
            "case",
            ["boolean", ["get", "has_title"], false],
            c.IMPORTANT_BORING_BLDG_FILL_COLOR,
            c.BORING_BLDG_FILL_COLOR
        ],
        "fill-antialias": true,
    }
}