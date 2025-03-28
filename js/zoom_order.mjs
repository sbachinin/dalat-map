import {
    datanla_waterfall_layer,
    french_buildings_titles,
    major_road_thinner_line,
    major_road_thicker_line,
    peaks_triangles_with_titles,
    tertiary_road,
    french_bldg_circle,
    french_bldg_fill,
    land_areas_fill,
    non_french_titles
} from "./drawing_layers.mjs";
import { FIRST_CLASS_FRENCH_MINZOOM, FRENCH_GEOMETRIES_MINZOOM } from "./layers/constants.mjs";
import { SOURCES_NAMES } from "./sources.mjs";


const get_filter_by_fid = (...fids) => ["any", ...fids.map(fid => ["==", ["id"], fid])]

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

    0: [
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
        },
        {
            selector: {
                source: SOURCES_NAMES.DALAT_TILES,
                'source-layer': 'land_areas',
                filter: ["!=", "$id", 1307493492]
            },
            drawing_layers: [land_areas_fill],
            drawing_importance: 4
        }
    ],

    [FIRST_CLASS_FRENCH_MINZOOM]: [
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
        },
        {
            selector: {
                source: SOURCES_NAMES.DALAT_TILES,
                "source-layer": "french_building",
            },
            drawing_layers: [french_bldg_circle],
            maxzoom: FRENCH_GEOMETRIES_MINZOOM
        },
        {
            selector: {
                "source": SOURCES_NAMES.TITLES_POINTS,
                filter: get_filter_by_fid(
                    99661171, // golf course
                    969458761, // university
                    463866449, // bus station
                    1232634198, // stadium
                )
            },
            drawing_layers: [non_french_titles]
        },
        {
            selector: {
                source: SOURCES_NAMES.TITLES_POINTS,
                filter: ["==", ["get", "is_french"], true]
            },
            drawing_layers: [french_buildings_titles]
        },
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