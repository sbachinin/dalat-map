import { SOURCES_NAMES } from "../constants.mjs";
import { DEAD_BUILDING_FILL_COLOR } from "./colors.mjs";
import {
    DEAD_BUILDINGS_CIRCLES_MINZOOM,
    MAJOR_BUILDINGS_POLYGONS_MINZOOM
} from "./constants.mjs";
import { DR_IM } from "./drawing_importance.mjs";

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