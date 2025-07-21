import { FRENCH_DEAD_FILL_COLOR, SELECTED_DEAD_FILL_COLOR } from "./common_drawing_layers/constants.mjs";
import { titles_common_layout_props } from "./common_drawing_layers/drawing_layers.mjs";
import { DEFAULT_MAX_ZOOM, RENDERABLES_NAMES } from "./constants.mjs";
import { make_title_point_feature } from "./utils/titles_points.mjs"

export const get_dead_buildings_renderable = (dead_buildings_features, all_handmade_data) => {
    return {
        id: RENDERABLES_NAMES.DEAD_BUILDINGS,
        get_features: () => [
            ...dead_buildings_features,
            ...dead_buildings_features
                .filter(f => all_handmade_data[f.id]?.title)
                .map(f => make_title_point_feature(f, all_handmade_data))
        ],
        style_layers: [
            {
                "type": "fill",
                "minzoom": 14,
                "paint": {
                    "fill-color": FRENCH_DEAD_FILL_COLOR,
                    "fill-antialias": true
                },
                filter: ["==", ["geometry-type"], "Polygon"],
                selectable: true
            },
            {
                type: 'line',
                "minzoom": 14,
                "paint": {
                    "line-color": FRENCH_DEAD_FILL_COLOR,
                    "line-width": 2,
                },
                filter: ["==", ["geometry-type"], "Polygon"],
                selectable: true
            },
            {
                "name": "Dead buildings titles",
                "type": "symbol",
                "minzoom": 15.5,
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
                    'text-color': 'hsl(0, 0%, 40%)',
                },
                selectable: true,
                filter: ["==", ["geometry-type"], "Point"]
            }
        ]
    }
}