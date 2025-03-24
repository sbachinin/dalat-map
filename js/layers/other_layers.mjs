import {
    all_titles_common_props,
    shit_titles_common_props
} from "./titles.mjs"
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

export const land_areas_fill = {
    id: 'Land areas fill',
    type: 'fill',
    source: SOURCES_NAMES.DALAT_TILES,
    'source-layer': 'land_areas',
    paint: {
        'fill-color': [
            "case",
            ["==", ["get", "area_type"], c.AREA_TYPES.INSTITUTION],
            c.INSTITUTION_FILL_COLOR,
            ["==", ["get", "area_type"], c.AREA_TYPES.CEMETERY],
            c.CEMETERY_FILL_COLOR,
            ["==", ["get", "area_type"], c.AREA_TYPES.SQUARE],
            c.SQUARE_FILL_COLOR,
            c.GRASS_COLOR
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
        "text-opacity": c.VARYING_TITLE_OPACITY
    },
    "filter": [">=", ["zoom"], ["coalesce", ["get", "min_zoom"], 0]]
}

export const peaks_triangles_with_titles = {
    id: 'Peaks triangles with titles',
    type: 'symbol',
    source: SOURCES_NAMES.DALAT_TILES,
    'source-layer': 'peaks',
    minzoom: c.FIRST_DETAILS_MINZOOM,
    layout: {
        "text-anchor": "top",
        "text-offset": [0, 0.3],
        'text-size': c.PALE_TITLES_SIZE,
        'text-font': ['Lato Regular'],
        "text-field": ["get", "ele"],
        "icon-image": "peak_triangle",
        "icon-size": 0.01,
    },
    paint: {
        'text-color': c.PEAK_TTTLE_COLOR
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