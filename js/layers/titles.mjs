import { SOURCES_NAMES } from "../sources.mjs"

import * as c from "./constants.mjs"

export const city_bulk_title = {
    id: 'cityBulk title',
    type: 'symbol',
    source: SOURCES_NAMES.DALAT_TILES,
    "source-layer": 'dalat_bulk_geometry_as_linestring',
    minzoom: 14.2,
    layout: {
        'text-field': 'Approximate residential limits of Dalat',
        'text-size': c.PALE_TITLES_SIZE,
        'text-font': ['Lato Regular'],
        'symbol-placement': 'line',
        "symbol-spacing": 300,
        "text-offset": [0, 1],
        "text-letter-spacing": 0.1
    },
    paint: {
        'text-color': c.CITY_BULK_TITLE_COLOR
    }
}
