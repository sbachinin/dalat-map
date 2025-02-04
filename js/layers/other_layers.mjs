import { all_titles_common_props, shit_titles_common_props } from "./buildings.mjs"
import { AREA_TYPES, CEMETERY_FILL_COLOR, CITY_BULK_DISAPPEARANCE_ZOOM, CITY_BULK_FULL_OPACITY_MAXZOOM, FIRST_DETAILS_MINZOOM, GRASS_COLOR, INSTITUTION_FILL_COLOR, PALE_TITLES_SIZE, PEAK_TTTLE_COLOR, SQUARE_FILL_COLOR, VARYING_TITLE_OPACITY } from "./constants.mjs"

export const city_bulk = {
    id: 'cityBulk',
    type: 'fill',
    source: 'dalat-tiles',
    "source-layer": 'dalat_bulk_geometry',
    minzoom: 10,
    maxzoom: 14.3,
    paint: {
        'fill-color': 'RGB(237, 195, 180)',
        'fill-antialias': true,
        "fill-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            CITY_BULK_FULL_OPACITY_MAXZOOM,
            1,
            CITY_BULK_DISAPPEARANCE_ZOOM,
            0
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
            ["==", ["get", "area_type"], AREA_TYPES.CEMETERY],
            CEMETERY_FILL_COLOR,
            ["==", ["get", "area_type"], AREA_TYPES.SQUARE],
            SQUARE_FILL_COLOR,
            GRASS_COLOR
        ],

        // 'hsl(70, 30%, 83%)', // ana mandara

        'fill-antialias': true,
    },
    filter: ["!=", "$id", 1307493492]
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

export const peaks_triangles_with_titles = {
    id: 'Peaks triangles with titles',
    type: 'symbol',
    source: "dalat-tiles",
    'source-layer': 'peaks',
    minzoom: FIRST_DETAILS_MINZOOM,
    layout: {
        "text-anchor": "top",
        "text-offset": [0, 0.3],
        'text-size': PALE_TITLES_SIZE,
        'text-font': ['Lato Regular'],
        "text-field": ["get", "ele"],
        "icon-image": "peak_triangle",
        "icon-size": 0.01,
    },
    paint: {
        'text-color': PEAK_TTTLE_COLOR
    }
}