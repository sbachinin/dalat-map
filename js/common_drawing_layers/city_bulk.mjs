import * as c from "./constants.mjs"

export const city_bulk_fill = {
    type: 'fill',
    filter: ['==', ['geometry-type'], 'Polygon'],
    drawing_importance: 7,
    paint: {
        'fill-color': c.CITY_BULK_FULL_COLOR,
        'fill-antialias': true,
        "fill-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            c.CITY_BULK_FULL_OPACITY_MAXZOOM,
            1,
            '$$_CITY_BULK_DISAPPEARANCE_ZOOM',
            0
        ]
    },
}

export const city_bulk_border = {
    type: 'line',
    filter: ['==', ['geometry-type'], 'Polygon'],
    paint: {
        'line-color': [
            "interpolate",
            ["linear"],
            ["zoom"],
            c.CITY_BULK_FULL_OPACITY_MAXZOOM,
            'black',
            '$$_CITY_BULK_DISAPPEARANCE_ZOOM',
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
            14.8,
            0.2
        ]
    }
}



export const city_bulk_title = {
    type: 'symbol',
    minzoom: 15,
    filter: ['==', ['geometry-type'], 'LineString'],
    layout: {
        'text-field': 'Approx. residential limits',
        'text-size': c.PALE_TITLES_SIZE - 1.5,
        'text-font': ['Lato Regular'],
        'symbol-placement': 'line',
        "symbol-spacing": 300,
        "text-offset": [0, 1],
        "text-letter-spacing": 0.07,
    },
    paint: {
        'text-color': c.CITY_BULK_TITLE_COLOR
    }
}
