import {
    AREA_TYPES,
    BORING_BLDG_FILL_COLOR,
    CEMETERY_FILL_COLOR,
    FIRST_CLASS_FRENCH_MINZOOM,
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
    IMPORTANT_BORING_BLDG_IN_FOREST_FILL_COLOR,
    BORING_BLDG_WITH_DETAILS_BORDER_COLOR,
    BRIGHT_LAKE_COLOR,
    PALE_LAKE_COLOR,
    AIRPORT_FILL_COLOR,
} from "./constants.mjs";
import { DEFAULT_MAX_ZOOM, SOURCES_NAMES } from "../constants.mjs";


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
    source: SOURCES_NAMES.CITY_TILES,
    'source-layer': 'titles_points',
    layout: {
        ...titles_common_layout_props,
        'text-size': [
            "interpolate",
            ["linear"],
            ["zoom"],
            14,
            12,
            DEFAULT_MAX_ZOOM,
            16
        ],
        'text-font': ['Merriweather Italic']
    },
    paint: {
        'text-color': FRENCH_TITLES_TEXT_COLOR,
    },
    selectable: true,
    filter: ["==", ["get", "building:architecture"], 'french_colonial']
}



export const french_bldg_circle = {
    "name": "French building circle",
    "type": "symbol",

    // could use 'bldgs_centroids_points' source,
    // it would be consistent with how non-french squares are rendered,
    // but centroids source hasn't 'has_title' property
    "source": "bldgs_centroids_points",
    filter: ["==", ["get", "is_french"], true],
    drawing_importance: 2,
    layout: {
        "icon-image": "french_circle",
        "icon-size": [
            "case",
            ["==", ["get", "has_title"], true],
            0.15,
            0.12
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
                0.6
            ],
            14,
            1
        ],
    }
}






export const peaks_triangles_with_titles = {
    name: 'Peaks triangles with titles',
    type: 'symbol',
    source: SOURCES_NAMES.CITY_TILES,
    'source-layer': 'peaks',
    layout: {
        "text-anchor": "top",
        "text-offset": [0, 0.4],
        'text-size': PALE_TITLES_SIZE - 1,
        'text-font': ['Lato Regular'],
        "text-field": ["get", "title"],
        "icon-image": "peak_triangle",
        "icon-size": 0.16
    },
    paint: {
        'text-color': PEAK_TTTLE_COLOR
    }
}













const road_color = "hsl(30, 0%, 59%)"
export const minor_road_color = "hsl(30, 0%, 81%)"

export const major_road_thicker_line = {
    "id": "Major road thicker line",
    "type": "line",
    "source": SOURCES_NAMES.CITY_TILES,
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
    drawing_importance: 4
}

export const major_road_thinner_line = {
    "id": "Major road thinner line",
    "type": "line",
    "source": SOURCES_NAMES.CITY_TILES,
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
    drawing_importance: 3
}





export const land_areas_fill = {
    name: 'Land areas fill',
    type: 'fill',
    source: SOURCES_NAMES.CITY_TILES,
    'source-layer': 'land_areas',
    drawing_importance: 6,
    paint: {
        'fill-color': [
            "case",
            ["==", ["get", "area_type"], AREA_TYPES.INSTITUTION],
            INSTITUTION_FILL_COLOR,
            ["==", ["get", "area_type"], AREA_TYPES.CEMETERY],
            CEMETERY_FILL_COLOR,
            ["==", ["get", "area_type"], AREA_TYPES.SQUARE],
            SQUARE_FILL_COLOR,
            ["==", ["get", "area_type"], AREA_TYPES.AIRPORT],
            AIRPORT_FILL_COLOR,
            GRASS_COLOR
        ],
        'fill-antialias': true,
        'fill-opacity': 1
    },
    filter: ["!=", "area_type", AREA_TYPES.TOWN],
}


export const towns_fill = {
    name: 'Towns fill',
    type: 'fill',
    source: SOURCES_NAMES.CITY_TILES,
    'source-layer': 'land_areas',
    drawing_importance: 7,
    paint: {
        'fill-color': 'hsl(0, 0%, 93%)',
        'fill-antialias': true,
        'fill-opacity': 1
    },
    filter: ["==", "area_type", AREA_TYPES.TOWN],
}

export const non_french_titles = {
    name: "Non french titles",
    "type": "symbol",
    "source": SOURCES_NAMES.CITY_TILES,
    'source-layer': 'titles_points',
    layout: {
        ...titles_common_layout_props,
        'text-size': [
            "interpolate",
            ["linear"],
            ["zoom"],
            FIRST_CLASS_FRENCH_MINZOOM,
            PALE_TITLES_SIZE - 1.5,
            DEFAULT_MAX_ZOOM,
            PALE_TITLES_SIZE,
        ],
        'text-font': ['Lato Regular']
    },
    paint: {
        'text-color': [
            "case",
            ["==", ["get", "feature_type"], 'water'],
            WATER_TITLE_COLOR,
            PALE_TITLES_COLOR
        ]
    },
    selectable: true,
    filter: ["!=", ["get", "building:architecture"], 'french_colonial']
}



export const cable_car_line = {
    "name": "Cable car line",
    type: 'line',
    source: SOURCES_NAMES.CITY_TILES,
    'source-layer': 'transportation_other',
    drawing_importance: 4,
    "paint": {
        "line-color": "#6666ff",
        "line-width": [
            "interpolate", ["linear"], ["zoom"],
            10, 1,
            15, 2
        ],
        "line-dasharray": [1, 1]
    },
    "filter": ["in", ["get", "aerialway"], ["literal", ["gondola", "cable_car"]]]
}

export const cable_car_endpoints = {
    "name": "Cable car endpoints",
    "type": "symbol",
    source: SOURCES_NAMES.CITY_TILES,
    'source-layer': 'transportation_other',
    "filter": ["==", ["get", "aerialway"], "station"],
    "layout": {
        "icon-image": "boring_square",
        "icon-size": [
            "interpolate",
            ["linear"],
            ["zoom"],
            11,
            0.12,
            16,
            0.22
        ],
        'icon-allow-overlap': true,
    }
}


export const boring_building_square = {
    "name": "Boring building square",
    "type": "symbol",
    source: 'bldgs_centroids_points',
    drawing_importance: 3,
    "layout": {
        "icon-image": "boring_square",
        "icon-size": 0.12,
        'icon-allow-overlap': true,
    }
}



export const railway_line = {
    "name": "Railway line",
    "type": "line",
    "source": SOURCES_NAMES.CITY_TILES,
    "source-layer": "railway",
    drawing_importance: 5,
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
    filter: ["==", ["get", "railway"], "rail"],
}

export const railway_station_titles_with_squares = {
    name: 'Train station tiny squares with titles',
    type: 'symbol',
    source: SOURCES_NAMES.CITY_TILES,
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
    "filter": ["==", "$id", 3377406129]  // only Trai Mat
}


export const boring_building_fill = {
    "name": "Boring building fill",
    "type": "fill",
    "source": SOURCES_NAMES.CITY_TILES,
    "source-layer": "boring_building",
    drawing_importance: 5,
    "paint": {
        "fill-color": [
            "case",
            ["any",
                ['==', ['id'], 17873628],
                ['==', ['id'], 361851927],
            ],
            IMPORTANT_BORING_BLDG_IN_FOREST_FILL_COLOR,
            BORING_BLDG_FILL_COLOR
        ],
        "fill-antialias": true,
    }
}

export const important_boring_building_fill = {
    name: 'Important (selectable or titled) boring building fill',
    type: 'fill',
    source: SOURCES_NAMES.CITY_TILES,
    'source-layer': 'important_boring_building',
    drawing_importance: 3,
    "paint": {
        "fill-color": IMPORTANT_BORING_BLDG_FILL_COLOR,
        "fill-antialias": true
    },
    selectable: true
}



export const selectable_boring_bldg_border = {
    name: 'Selectable boring building border',
    'type': 'line',
    "source": SOURCES_NAMES.CITY_TILES,
    "source-layer": "important_boring_building",
    drawing_importance: 3,
    'paint': {
        'line-color': BORING_BLDG_WITH_DETAILS_BORDER_COLOR
    },
    filter: ["==", ["get", "is_selectable"], true],
    selectable: true
}



















export const stadium_fill = {
    "name": "Stadium fill",
    "type": "fill",
    "source": SOURCES_NAMES.CITY_TILES,
    "source-layer": "stadiums",
    "paint": {
        "fill-color": 'hsl(120, 40%, 85%)'
    }
}


export const water_areas_fill = {
    "name": "Water areas fill",
    "type": "fill",
    "source": SOURCES_NAMES.CITY_TILES,
    "source-layer": "water_areas",
    drawing_importance: 6,
    "paint": {
        "fill-color": [
            "interpolate",
            ["linear", 2],
            ["zoom"],
            10, BRIGHT_LAKE_COLOR,
            13.7, PALE_LAKE_COLOR,
        ]
    }
}

export const sea_fill = {
    ...water_areas_fill,
    name: 'Sea fill',
    'source-layer': 'sea_body',
    drawing_importance: 10
}

export const island_fill = {
    name: 'Island fill',
    "type": "fill",
    "source": SOURCES_NAMES.CITY_TILES,
    "source-layer": "islands",
    drawing_importance: 9,
    "paint": { "fill-color": 'white' },
}


export const city_title = {
    "name": "City title",
    "type": "symbol",
    source: SOURCES_NAMES.CITY_TITLE,
    drawing_importance: 1,
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
    drawing_importance: 7,
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
