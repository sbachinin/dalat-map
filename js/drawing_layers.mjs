import { FRENCH_TITLES_TEXT_COLOR } from "./layers/constants.mjs";
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