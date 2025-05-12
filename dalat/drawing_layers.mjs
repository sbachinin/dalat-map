import { PALE_TITLES_SIZE, WATER_TITLE_COLOR } from "../js/layers/constants.mjs";

export const datanla_waterfall_layer = {
    name: "Datanla waterfall",
    type: 'symbol',
    source: 'datanla_waterfall',
    layout: {
        "icon-image": "water_square",
        "icon-size": 0.12,
        "text-field": "Datanla\nwaterfall",
        "text-anchor": "top",
        "text-offset": [0, 0.2],
        'text-size': PALE_TITLES_SIZE,
        'text-font': ['Lato Regular'],
        "symbol-sort-key": 1,
    },
    paint: {
        'text-color': WATER_TITLE_COLOR
    },
}