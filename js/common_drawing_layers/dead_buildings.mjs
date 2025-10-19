import { DEFAULT_MAX_ZOOM, SOURCES_NAMES } from "../constants.mjs";
import {
    DEAD_BUILDING_FILL_COLOR,
    DEAD_BUILDINGS_CIRCLES_MINZOOM,
    MAJOR_BUILDINGS_POLYGONS_MINZOOM
} from "./constants.mjs";
import { DR_IM } from "./drawing_importance.mjs";
import { titles_common_layout_props } from "./drawing_layers.mjs";

export const dead_buildings_layers = [
    {
        id: "Dead buildings fill",
        source: SOURCES_NAMES.CITY_TILES,
        'source-layer': 'dead_buildings',
        "type": "fill",
        "minzoom": MAJOR_BUILDINGS_POLYGONS_MINZOOM,
        "paint": {
            "fill-color": DEAD_BUILDING_FILL_COLOR,
            "fill-antialias": true
        },
        filter: ["==", ["geometry-type"], "Polygon"],
        drawing_importance: DR_IM.DEAD_BUILDINGS_FILL
    },
    /* {
        id: "Dead buildings border",
        source: SOURCES_NAMES.CITY_TILES,
        'source-layer': 'dead_buildings',
        type: 'line',
        "minzoom": MAJOR_BUILDINGS_POLYGONS_MINZOOM,
        "paint": {
            "line-color": FRENCH_DEAD_FILL_COLOR,
            "line-width": 2,
        },
        filter: ["==", ["geometry-type"], "Polygon"],
    }, */
    {
        "id": "Dead buildings titles",
        "source": SOURCES_NAMES.CITY_TILES,
        'source-layer': 'dead_buildings',
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
        filter: ["==", ["geometry-type"], "Point"]
    },

    {
        "id": "Dead building circle",
        "type": "symbol",
        source: 'bldgs_centroids_points',
        drawing_importance: DR_IM.DEAD_BUILDINGS_CIRCLES,
        "layout": {
            "icon-image": "dead_circle",
            "icon-size": 0.12,
            'icon-allow-overlap': true,
        },
        filter: ['==', ['get', 'is_dead'], true],
        minzoom: DEAD_BUILDINGS_CIRCLES_MINZOOM,
        maxzoom: MAJOR_BUILDINGS_POLYGONS_MINZOOM
    }
]