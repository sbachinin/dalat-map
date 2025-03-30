import {
    AREA_TYPES,
    BORING_BLDG_FILL_COLOR,
    CEMETERY_FILL_COLOR,
    FIRST_CLASS_FRENCH_MINZOOM,
    FRENCH_FILL_COLOR,
    FRENCH_TITLES_TEXT_COLOR,
    GRASS_COLOR,
    IMPORTANT_BORING_BLDG_FILL_COLOR,
    INSTITUTION_FILL_COLOR,
    WATER_TITLE_COLOR,
    PALE_TITLES_COLOR,
    PALE_TITLES_SIZE,
    PEAK_TTTLE_COLOR,
    RAILWAY_LINE_COLOR,
    SQUARE_FILL_COLOR,
    CITY_BULK_TITLE_COLOR
} from "./layers/constants.mjs";
import { SOURCES_NAMES } from "./sources.mjs";


export const titles_common_layout_props = {
    "text-field": ["get", "title"],
    "text-anchor": [
        "case",
        ["==", ["get", "title_side"], "south"],
        "top",
        ["==", ["get", "title_side"], "north"],
        'bottom',
        "center"
    ],
    "text-offset": [
        "case",
        ["==", ["get", "title_side"], "north"],
        ["literal", [0, -0.2]],
        ["==", ["get", "title_side"], "south"],
        ["literal", [0, 0.2]],
        ["literal", [0, 0]]
    ],
    'symbol-sort-key': [
        "case",
        ['has', 'symbol-sort-key'],
        ['get', 'symbol-sort-key'],
        1
    ],
    'text-padding': 1
}


export const french_buildings_titles = {
    "name": "French buildings titles",
    "type": "symbol",
    source: SOURCES_NAMES.TITLES_POINTS,
    layout: {
        ...titles_common_layout_props,
        'text-size': [
            "interpolate",
            ["linear"],
            ["zoom"],
            14,
            11,
            17.5,
            15
        ],
        'text-font': ['Merriweather Italic']
    },
    paint: {
        'text-color': FRENCH_TITLES_TEXT_COLOR,
    },
}



export const french_bldg_circle = {
    "name": "French building circle",
    "type": "symbol",
    source: SOURCES_NAMES.DALAT_TILES,
    "source-layer": "french_building",
    layout: {
        "icon-image": "french_circle",
        "icon-size": [
            "case",
            ["==", ["get", "has_title"], true],
            0.13,
            0.1
        ],
        "icon-allow-overlap": true,
    },
    paint: {
        "icon-opacity": [
            // at first only titled bldgs are fully opaque,
            // others are faded in from 35%
            "interpolate",
            ["linear"],
            ["zoom"],
            FIRST_CLASS_FRENCH_MINZOOM,
            [
                "case",
                ["==", ["get", "has_title"], true],
                1,
                0.35
            ],
            14,
            1
        ],
    }
}


export const french_bldg_fill = {
    "name": "French building fill",
    "type": "fill",
    source: SOURCES_NAMES.DALAT_TILES,
    "source-layer": "french_building",
    "paint": {
        "fill-color": FRENCH_FILL_COLOR,
        "fill-antialias": true
    },
}




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


export const peaks_triangles_with_titles = {
    name: 'Peaks triangles with titles',
    type: 'symbol',
    source: SOURCES_NAMES.DALAT_TILES,
    'source-layer': 'peaks',
    layout: {
        "text-anchor": "top",
        "text-offset": [0, 0.3],
        'text-size': PALE_TITLES_SIZE,
        'text-font': ['Lato Regular'],
        "text-field": ["get", "ele"],
        "icon-image": "peak_triangle",
        "icon-size": 0.2,
    },
    paint: {
        'text-color': PEAK_TTTLE_COLOR
    }
}













const road_color = "hsl(30, 0%, 59%)"
const darker_tertiary_road_color = "hsl(30, 0%, 71%)"
const minor_road_color = "hsl(30, 0%, 73%)"

export const major_road_thicker_line = {
    "name": "Major road thicker line",
    "type": "line",
    "source": SOURCES_NAMES.DALAT_TILES,
    "source-layer": "major_roads",
    "paint": {
        "line-color": road_color,
        "line-width": [
            "interpolate",
            ["linear", 2],
            ["zoom"],
            12, 1.5,
            16, 6,
            20, 9
        ]
    },
    "layout": {
        "line-cap": "round",
        "line-join": "round",
    },
}

export const major_road_thinner_line = {
    "name": "Major road thinner line",
    "type": "line",
    "source": SOURCES_NAMES.DALAT_TILES,
    "source-layer": "major_roads",
    "paint": {
        "line-color": [
            "interpolate",
            ["linear", 2],
            ["zoom"],
            12.5,
            road_color,
            13.8,
            '#e4e4e4'
        ],
        "line-width": [
            "interpolate",
            ["linear", 2],
            ["zoom"],
            14, 1.5,
            16, 3,
            20, 5
        ]
    },
    "layout": {
        "line-cap": "round",
        "line-join": "round",
    },
}

export const tertiary_road = {
    name: 'Tertiary road',
    "source": SOURCES_NAMES.DALAT_TILES,
    "source-layer": "major_roads",
    type: 'line',
    "paint": {

        "line-color": darker_tertiary_road_color,
        "line-width": [
            "interpolate",
            ["linear", 2],
            ["zoom"],
            10, 1,
            14, 1.5,
            16, 3.5,
            20, 6
        ],
    },
    "layout": {
        "line-cap": "round",
        "line-join": "round",
    },
}




export const land_areas_fill = {
    name: 'Land areas fill',
    type: 'fill',
    source: SOURCES_NAMES.DALAT_TILES,
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
        'fill-antialias': true,
        'fill-opacity': [
            "interpolate",
            ["linear"],
            ["zoom"],
            11,
            0.5,
            13,
            1
        ]
    }
}



export const non_french_titles = {
    name: "Non french titles",
    "type": "symbol",
    "source": SOURCES_NAMES.TITLES_POINTS,
    layout: {
        ...titles_common_layout_props,
        'text-size': [
            "interpolate",
            ["linear"],
            ["zoom"],
            FIRST_CLASS_FRENCH_MINZOOM,
            PALE_TITLES_SIZE - 1.5,
            17.5,
            PALE_TITLES_SIZE,
        ],
        'text-font': ['Lato Regular']
    },
    paint: {
        'text-color': [
            "case",
            ["==", ["get", "is_water"], true],
            WATER_TITLE_COLOR,
            PALE_TITLES_COLOR
        ]
    }
}



export const cable_car_line = {
    "name": "Cable car line",
    type: 'line',
    source: SOURCES_NAMES.DALAT_TILES,
    'source-layer': 'transportation_other',
    "paint": {
        "line-color": "#6666ff",
        "line-width": [
            "interpolate", ["linear"], ["zoom"],
            10, 1,
            15, 2
        ],
        "line-dasharray": [1, 1]
    }
}
export const cable_car_label = {
    "name": "Cable car label",
    type: 'symbol',
    source: SOURCES_NAMES.DALAT_TILES,
    'source-layer': 'transportation_other',
    "layout": {
        "text-field": "Cable car",
        "text-font": ["Lato Regular"],
        "text-size": 10,
        "symbol-placement": "line",
        "text-letter-spacing": 0.1,
        "text-anchor": "bottom",
        "text-offset": [0, -0.1]
    },
    "paint": {
        "text-color": PALE_TITLES_COLOR,
    },
}

export const cable_car_endpoints = {
    "name": "Cable car endpoints",
    "type": "symbol",
    source: 'cable_car_endpoints_source',
    "layout": {
        "icon-image": "boring_square",
        "icon-size": 0.12,
        'icon-allow-overlap': true,
    }
}


export const boring_building_square = {
    "name": "Boring building square",
    "type": "symbol",
    source: 'bldgs_centroids_points',
    "layout": {
        "icon-image": "boring_square",
        "icon-size": 0.12,
        'icon-allow-overlap': true,
    }
}





export const railway_line = {
    "name": "Railway line",
    "type": "line",
    "source": SOURCES_NAMES.DALAT_TILES,
    "source-layer": "railway",
    "layout": {
        "line-cap": "round",
        "line-join": "round"
    },
    "paint": {
        "line-color": RAILWAY_LINE_COLOR,
        "line-width": [
            "interpolate", ["linear"], ["zoom"],
            10, 1,
            14, 2,
            16, 3
        ],
    },
}

export const railway_station_titles_with_squares = {
    name: 'Train station tiny squares with titles',
    type: 'symbol',
    source: SOURCES_NAMES.DALAT_TILES,
    'source-layer': 'railway',
    layout: {
        "text-anchor": "top",
        "text-offset": [0, 0.2],
        'text-size': PALE_TITLES_SIZE,
        'text-font': ['Lato Regular'],
        'text-field': 'Trai Mat\nstation',
        "icon-image": "boring_square",
        "icon-size": 0.15,
    },
    paint: {
        'text-color': PALE_TITLES_COLOR
    },
}


export const boring_building_fill = {
    "name": "Boring building fill",
    "type": "fill",
    "source": SOURCES_NAMES.DALAT_TILES,
    "source-layer": "boring_building",
    "paint": {
        "fill-color": [
            "case",
            ["boolean", ["get", "has_title"], false],
            IMPORTANT_BORING_BLDG_FILL_COLOR,
            BORING_BLDG_FILL_COLOR
        ],
        "fill-antialias": true,
    }
}
















const minor_road_width_etc = {
    "line-width": [
        "interpolate",
        ["linear", 2],
        ["zoom"],
        13.7, 1,
        20, 2
    ],
    "line-color": minor_road_color,
    'line-blur': 1,
}

export const minor_road = {
    "name": "Minor road",
    "type": "line",
    "source": SOURCES_NAMES.DALAT_TILES,
    "source-layer": "minor_roads",
    "layout": {
        "line-cap": "round",
        "line-join": "round",
    },
    "paint": {
        ...minor_road_width_etc,
    },
}

export const pedestrian_path = {
    "name": "pedestrian paths",
    "type": "line",
    "source": SOURCES_NAMES.DALAT_TILES,
    "source-layer": "minor_roads",
    "layout": {
        "line-cap": "round",
        "line-join": "round",
    },
    "paint": {
        ...minor_road_width_etc,
        "line-dasharray": [2, 2]
    }
}



export const city_bulk_title = {
    name: 'cityBulk title',
    type: 'symbol',
    source: SOURCES_NAMES.DALAT_TILES,
    "source-layer": 'dalat_bulk_geometry_as_linestring',
    layout: {
        'text-field': 'Approximate residential limits of Dalat',
        'text-size': PALE_TITLES_SIZE - 1.5,
        'text-font': ['Lato Regular'],
        'symbol-placement': 'line',
        "symbol-spacing": 300,
        "text-offset": [0, 1],
        "text-letter-spacing": 0.07,
    },
    paint: {
        'text-color': CITY_BULK_TITLE_COLOR
    }
}

