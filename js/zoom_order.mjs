import {
    datanla_waterfall_layer,
    french_buildings_titles,
    major_road_thinner_line,
    major_road_thicker_line,
    peaks_triangles_with_titles,
    tertiary_road,
    french_bldg_circle,
    french_bldg_fill
} from "./drawing_layers.mjs";
import { FIRST_CLASS_FRENCH_MINZOOM, FRENCH_GEOMETRIES_MINZOOM } from "./layers/constants.mjs";
import { SOURCES_NAMES } from "./sources.mjs";

export const zoom_order = {
    /*
    [zoom_level_float]: [
        {
            // what features to take, from what source and with what props?
            selector: {},

            // what and how to draw for these features?
            // (basically, maplibre style layers without "selector" and minzoom part)
            drawing_layers: [],

            // defaults to 1 (highest) and, as number goes up, move such stuff towards the beginning of the final layers array
            drawing_importance: number,
        }
    ]
    */

    10: [
        {
            selector: {
                "source": SOURCES_NAMES.DALAT_TILES,
                "source-layer": "major_roads",
                "filter": ["in", "highway", "tertiary"]
            },
            drawing_layers: [tertiary_road],
            drawing_importance: 3
        },
        {
            selector: {
                "source": SOURCES_NAMES.DALAT_TILES,
                "source-layer": "major_roads",
                "filter": ["!in", "highway", "tertiary"]
            },
            drawing_layers: [major_road_thicker_line],
            drawing_importance: 3
        }
    ],

    [FIRST_CLASS_FRENCH_MINZOOM]: [
        {
            selector: {
                source: SOURCES_NAMES.DALAT_TILES,
                "source-layer": "french_building",
                // filter: ["all",
                //     ["==", ["get", "is_important"], true],
                //     ["==", ["get", "has_title"], true]
                // ]
            },
            drawing_layers: [french_bldg_circle],
            maxzoom: FRENCH_GEOMETRIES_MINZOOM
        },
        {
            selector: {
                source: SOURCES_NAMES.BUILDING_TITLE,
                filter: ["==", ["get", "is_french"], true]
            },
            drawing_layers: [french_buildings_titles]
        },
        {
            selector: {
                source: 'datanla_waterfall',
            },
            drawing_layers: [datanla_waterfall_layer]
        },
        {
            selector: {
                source: SOURCES_NAMES.DALAT_TILES,
                'source-layer': 'peaks',
            },
            drawing_layers: [peaks_triangles_with_titles]
        }
    ],
    12.5: [
        {
            selector: {
                "source": SOURCES_NAMES.DALAT_TILES,
                "source-layer": "major_roads",
                "filter": ["!in", "highway", "tertiary"]
            },
            drawing_layers: [major_road_thinner_line],
            drawing_importance: 2
        }
    ],
    [FRENCH_GEOMETRIES_MINZOOM]: [
        {
            selector: {
                source: SOURCES_NAMES.DALAT_TILES,
                "source-layer": "french_building",
            },
            drawing_layers: [french_bldg_fill]
        }
    ]
}