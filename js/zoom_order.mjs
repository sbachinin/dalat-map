/* 

This is an attempt to organize layers by zoom level,
otherwise this logic tends to grow wildly,
and at some point I found it almost impossible to understand.
So the main rationale is
1) readability and maintainability, centralization of zoom level logic
2) enforcing the "zoom-first" development,
    as it seems critically important to have "the right set of features" at any given zoom
3) automated sorting of style layers based on zoom level.
    (unless drawing_importance tells that this specific layer has to disobey the zoom order)
    Features from the most "early" zoom levels appear later in the layers[].
    Basically this sorting problem doesn't seem too important...
    Because anyway I handpick the features for each zoom level,
        and so they shouldn't compete, and so the order of layers must be of no importance...
    But I think that handpicking shouldn't be the only instrument,
        and some minor mistakes in handpicking must be allowed, 
        and proper layers' order will compensate for these mistakes.



Why is this separation into zoom levels necessary at all?
(Maplibre gives many ways to manage the titles' priority
    so that important ones appeared first, and then,
    as you zoom in, less important pop up.
    So in theory, I could avoid setting any minzooms and just watch the magic).
My opinionated decision was not to delegate the zoom order to
maplibre's sorting algorithm because it generally tends to create a lot of mess,
titles competing for space, appearing and disappearing ad hoc, blinking etc.
So I manually choose what appears when.
Also, I don't want to show AS MUCH TITLES AS POSSIBLE at a given moment.
It's nice to have some free space sometimes.

*/

import {
    datanla_waterfall_layer,
    french_buildings_titles,
    major_road_thinner_line,
    major_road_thicker_line,
    peaks_triangles_with_titles,
    tertiary_road,
    french_bldg_circle,
    non_french_titles,
    cable_car_line,
    cable_car_label,
    cable_car_endpoints,
    railway_line,
    railway_station_titles_with_squares,
    boring_building_fill,
    boring_bldg_with_details_border,
    minor_road,
    pedestrian_path,
    city_bulk_title,
    boring_building_square
} from "./drawing_layers.mjs";
import {
    BORING_BLDGS_MINZOOM,
    FIRST_CLASS_FRENCH_MINZOOM,
    FRENCH_GEOMETRIES_MINZOOM,
} from "./layers/constants.mjs";
import {
    french_detailful_bldg_fill,
    french_detailful_dark_outline,
    french_detailful_thickening_outline,
    french_detailless_bldg_fill,
    french_detailless_dark_outline,
    french_detailless_thickening_outline
} from "./layers/french_polygons.mjs";

import { all_handmade_data as hmd } from "../dalat/handmade_data.mjs";

const get_filter_by_fids = (...features) => ["any", ...features.map(f => ["==", ["id"], +f.id])]

export const zoom_order = {
    /*
    [zoom_level_float]: [
        {
            filter: [],

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
            drawing_layers: [tertiary_road],
            drawing_importance: 4
        },
        {
            drawing_layers: [major_road_thicker_line],
            drawing_importance: 4
        }
    ],

    [FIRST_CLASS_FRENCH_MINZOOM]: [
        { drawing_layers: [datanla_waterfall_layer] },
        { drawing_layers: [cable_car_line, cable_car_label] },
        { drawing_layers: [cable_car_endpoints] },
        { drawing_layers: [peaks_triangles_with_titles] },
        {
            drawing_layers: [french_bldg_circle],
            maxzoom: FRENCH_GEOMETRIES_MINZOOM,
            drawing_importance: 2
        },
        {
            drawing_layers: [non_french_titles],
            filter: get_filter_by_fids(
                hmd[99661171], // golf course
                hmd[969458761], // university
                hmd[463866449], // bus station
                hmd[1232634198], // stadium
            ),
        },
        { drawing_layers: [french_buildings_titles] },
    ],
    12.5: [
        {
            drawing_layers: [major_road_thinner_line],
            drawing_importance: 3
        }
    ],
    13: [

        // The following was commented out because:
        // Text placement changes for a line with each zoom level.
        // This goes against one of my main rules, which is "preserve positions of texts as you zoom in"
        // In theory I could mitigate the blinking
        // Here is 1 way which is basically quite complicated and still allows some entropy:
        // - cut the river into pieces and draw texts for certain small pieces.
        /*
        {
            drawing_layers: [rivers_titles],
            "filter": ["all",
                ["!has", "tunnel"],
                ['==', 'name', 'Suối Cam Ly']
            ],
            drawing_importance: 2
        },
         */
        {
            drawing_layers: [railway_line],
        },
        {
            drawing_layers: [minor_road],
            filter: ["in", "highway", "residential", "unclassified"],
            drawing_importance: 5
        },
        { drawing_layers: [railway_station_titles_with_squares] },
        {
            filter: [
                "any",
                ["==", ["get", "is_water"], true],
                get_filter_by_fids(
                    hmd[473556887], // hospital
                    hmd[1244767000], // nguyen tomb
                    hmd[473755163], // du sinh cemetery
                    hmd[473547288], // nuclear research
                    hmd[4119185], // market
                    hmd[521598340], // yersin univer
                    hmd[1307493492], // ana mandara 
                    hmd[18645373], // co sat pagoda
                    hmd[361851927], // linh son pagoda
                    hmd[1355564844], // military academy
                    hmd[1356287796], // truc lam monastery
                    hmd[1305230699], // Madame
                    hmd[7758125], // youth prison
                    hmd[1303837487], // lam vien square
                )
            ],
            drawing_layers: [non_french_titles]
        },
        {
            drawing_layers: [boring_building_square],
            filter: get_filter_by_fids(
                hmd[1244767000],
                hmd[1305230699],
                hmd[361851927],
                hmd[4119185],
                hmd[308446691]
            ),
            maxzoom: BORING_BLDGS_MINZOOM,
            drawing_importance: 3
        }
    ],
    [FRENCH_GEOMETRIES_MINZOOM]: [
        {
            drawing_layers: [
                french_detailless_dark_outline,
                french_detailless_thickening_outline,
                french_detailless_bldg_fill
            ],
            drawing_importance: 2
        },
        {
            drawing_layers: [
                french_detailful_dark_outline,
                french_detailful_thickening_outline,
                french_detailful_bldg_fill
            ],
            drawing_importance: 2
        },
    ],
    [BORING_BLDGS_MINZOOM]: [
        {
            drawing_layers: [boring_building_fill],
            drawing_importance: 3
        },
        {
            drawing_layers: [boring_bldg_with_details_border],
            drawing_importance: 3
        },
        { drawing_layers: [non_french_titles] },
        { drawing_layers: [city_bulk_title] }
    ],
    14.5: [
        {
            drawing_layers: [minor_road],
            filter: [
                "!in",
                "highway",
                "residential", "unclassified",
                "footway", "path", "cycleway", "steps"
            ],
            drawing_importance: 5
        },
        {
            drawing_layers: [pedestrian_path],
            drawing_importance: 5
        },
    ]
}