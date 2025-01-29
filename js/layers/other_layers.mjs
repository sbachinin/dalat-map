import { all_titles_common_props, shit_titles_common_props } from "./buildings.mjs"
import { AREA_TYPES, GRASS_COLOR, INSTITUTION_FILL_COLOR, VARYING_TITLE_OPACITY } from "./constants.mjs"

export const city_bulk = {
    id: 'cityBulk',
    type: 'fill',
    source: 'cityBulk',
    minzoom: 10,
    maxzoom: 14.3,
    paint: {
        'fill-color': 'RGB(237, 195, 180)',
        'fill-antialias': true,
        "fill-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            13.6,  // Zoom level at which opacity should start decreasing
            1,   // Opacity at zoom level 14
            14.3,  // Zoom level just above 14
            0    // Opacity at zoom level 15 and higher
        ]
    }
}

export const land_areas_fill = {
    id: 'Land areas fill',
    type: 'fill',
    source: 'dalat-tiles',
    'source-layer': 'land_areas',
    paint: {
        'fill-color': [
            "case",
            ["==", ["get", "area_type"], AREA_TYPES.INSTITUTION],
            INSTITUTION_FILL_COLOR,
            GRASS_COLOR
        ],

        // 'hsl(70, 30%, 83%)', // ana mandara

        'fill-antialias': true,
    }
}


export const land_areas_titles = {
    id: 'Land areas titles',
    type: 'symbol',
    "source": "land_areas_titles",
    minzoom: 13, // TODO ok??
    layout: {
        ...all_titles_common_props.layout,
        ...shit_titles_common_props.layout,
        "text-anchor": 'center'
    },
    paint: {
        ...all_titles_common_props.paint,
        ...shit_titles_common_props.paint,
        "text-opacity": VARYING_TITLE_OPACITY
    }
}