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
    non_french_titles,
    cable_car_line,
    cable_car_label,
    cable_car_endpoints,
    railway_line,
    railway_station_titles_with_squares,
    boring_building_fill,
    minor_road,
    pedestrian_path
} from "./drawing_layers.mjs";
import {
    FIRST_CLASS_FRENCH_MINZOOM,
    FRENCH_GEOMETRIES_MINZOOM,
} from "./layers/constants.mjs";


const get_filter_by_fid = (...fids) => ["any", ...fids.map(fid => ["==", ["id"], fid])]

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
            "filter": ["in", "highway", "tertiary"],
            drawing_layers: [tertiary_road],
            drawing_importance: 3
        },
        {
            "filter": ["!in", "highway", "tertiary"],
            drawing_layers: [major_road_thicker_line],
            drawing_importance: 3
        },
        {
            filter: ["!=", "$id", 1307493492],
            drawing_layers: [land_areas_fill],
            drawing_importance: 4
        }
    ],

    [FIRST_CLASS_FRENCH_MINZOOM]: [
        { drawing_layers: [datanla_waterfall_layer] },
        {
            "filter": ["==", ["get", "aerialway"], "cable_car"],
            drawing_layers: [cable_car_line, cable_car_label]
        },
        { drawing_layers: [cable_car_endpoints] },
        { drawing_layers: [peaks_triangles_with_titles] },
        {
            drawing_layers: [french_bldg_circle],
            maxzoom: FRENCH_GEOMETRIES_MINZOOM,
            drawing_importance: 2
        },
        {
            drawing_layers: [non_french_titles],
            filter: get_filter_by_fid(
                99661171, // golf course
                969458761, // university
                463866449, // bus station
                1232634198, // stadium
            ),
        },
        {
            drawing_layers: [french_buildings_titles],
            filter: ["==", ["get", "is_french"], true]
        },
    ],
    12.5: [
        {
            drawing_layers: [major_road_thinner_line],
            "filter": ["!in", "highway", "tertiary"],
            drawing_importance: 2
        }
    ],
    13: [
        {
            drawing_layers: [railway_line],
            filter: ["==", ["get", "railway"], "rail"],
        },
        {
            drawing_layers: [railway_station_titles_with_squares],
            "filter": ["==", "$id", 3377406129]  // only Trai Mat
        },
        {
            filter: [
                "any",
                ["==", ["get", "is_water"], true],
                get_filter_by_fid(
                    473556887, // hospital
                    1244767000, // nguyen tomb
                    473755163, // du sinh cemetery
                    473547288, // nuclear research
                    4119185, // market
                    521598340, // yersin univer
                    1307493492, // ana mandara 
                    18645373, // co sat pagoda
                    361851927, // linh son pagoda
                    1355564844, // military academy
                    1356287796, // truc lam monastery
                    1305230699, // Madame
                    7758125, // youth prison
                )
            ],
            drawing_layers: [non_french_titles]
        },
    ],
    [FRENCH_GEOMETRIES_MINZOOM]: [
        {
            drawing_layers: [minor_road],
            filter: ["!=", "is_pedestrian_path", true]
        },
        {
            drawing_layers: [pedestrian_path],
            filter: ["==", "is_pedestrian_path", true]
        },
        {
            drawing_layers: [french_bldg_fill],
            drawing_importance: 2
        }
    ],
    14: [
        { drawing_layers: [boring_building_fill] },
        { drawing_layers: [non_french_titles] },
    ]
}