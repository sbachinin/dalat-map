import { FIRST_CLASS_FRENCH_MINZOOM, FRENCH_FILL_COLOR, FRENCH_TITLES_TEXT_COLOR, LAKE_TITLE_COLOR, PALE_TITLES_SIZE, PEAK_TTTLE_COLOR } from "./layers/constants.mjs";
import { deep_merge_objects } from "./utils/utils.mjs";


export const all_titles_common_props = {
    layout: {
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
}


export const french_buildings_titles = deep_merge_objects(all_titles_common_props,
    {
        "name": "French buildings titles",
        "type": "symbol",
        layout: {
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
)



export const french_bldg_circle = {
    "name": "French building circle",
    "type": "symbol",
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
    "paint": {
        "fill-color": FRENCH_FILL_COLOR,
        "fill-antialias": true
    },
}




export const datanla_waterfall_layer = {
    name: "Datanla waterfall",
    type: 'symbol',
    layout: {
        "icon-image": "water_square",
        "icon-size": 0.12,
        "text-field": "Datanla\nwaterfall",
        "text-anchor": "top",
        "text-offset": [0, 0.2],
        'text-size': PALE_TITLES_SIZE,
        'text-font': ['Lato Regular'],
        "symbol-sort-key": 1,
        "icon-allow-overlap": true,
        "text-allow-overlap": true,
    },
    paint: {
        'text-color': LAKE_TITLE_COLOR
    },
}


export const peaks_triangles_with_titles = {
    name: 'Peaks triangles with titles',
    type: 'symbol',
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