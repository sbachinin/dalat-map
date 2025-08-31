import { all_handmade_data, land_areas_handmade_data } from "./static_data/handmade_data.mjs"
import { AREA_TYPES } from "../js/common_drawing_layers/constants.mjs"
import { get_centroid, is_building_polygon, is_one_of } from "../js/utils/isomorphic_utils.mjs"
import { map_bounds } from "./isomorphic_assets.mjs"
import { area } from "@turf/turf"
import { is_feature_selectable } from "../js/utils/does_feature_have_details.mjs"
import { fids_to_img_names } from "./static_data/fids_to_img_names.mjs"
import { make_coastline } from "./make_coastline.mjs"
import { unesco_core_zone } from "./static_data/unesco_core_zone.mjs"
import { make_polygon_feat } from "../js/utils/isomorphic_utils.mjs"

export const assets_for_build = {
    map_bounds,
    html_title: 'Map of colonial architecture in Dalat',

    make_features_props_for_frontend: all_tiled_features => {

        const result = {}
        all_tiled_features.forEach(f => {
            if (!f.id) {
                console.log(f)
                process.exit(1)
            }


            if (false /* ? if is colonial */) {
                result[f.id] = {
                    // centroid is needed for french bldg even if it's not selectable because centroid is used to draw a building's circle at low z
                    centroid: get_centroid(f),
                    is_colonial: true // ?
                }
            }
        })
        return result
    },

    tiling_config: [
        {
            name: 'boring_building',
            get_custom_features: main_geojson_feats => {
                return main_geojson_feats.filter(f => {
                    return (
                        is_building_polygon(f)
                        && !f.properties.historic
                        && f.id !== 12743796
                        && f.id !== 383041700
                    )
                }).flatMap(f => {
                    if (f.id === 12743795) {
                        // split megamall
                        return [
                            make_polygon_feat(f.geometry.coordinates[0], 945759709, { has_title: true }),
                            make_polygon_feat(f.geometry.coordinates[1], 104954181, { has_title: true })
                        ]
                    }
                    return [{
                        ...f,
                        properties: { ...f.properties, has_title: !!all_handmade_data[f.id]?.title }
                    }]
                })
            },
            minzoom: 15
        },
        {
            name: 'historic_building',
            osm_feature_filter: f => {
                return f.id === 945813625 // st john fort is not a building
                    || (is_building_polygon(f)
                        && f.properties.historic)
            },
            props_to_add_to_osm_features: ['is_selectable', 'has_title'],
        },

        {
            name: 'important_boring_building',
            osm_feature_filter: f => f.properties?.building
                && !f.properties.historic
                && is_feature_selectable(f.id, all_handmade_data, fids_to_img_names),
            props_to_add_to_osm_features: ['is_selectable']
        },

        {
            name: 'railway',
            osm_feature_filter: f => f.properties.railway === 'rail' || f.properties.railway === 'station',
        },

        {
            name: 'sea_body',
            get_custom_features: make_coastline
        },
        {
            name: 'islands',
            osm_feature_filter: f => is_one_of(f.properties.place, ['island', 'islet']),
        },

        {
            name: 'peaks'
        },

        {
            name: 'river_areas',
            osm_feature_filter: f => f.properties.natural === 'water' && f.properties.water === 'river'
        },

        {
            name: 'river_lines',
            osm_feature_filter: f => (
                f.properties.waterway === 'stream' || f.properties.waterway === 'river'
            ) && f.id !== 104350337
        },

        {
            name: 'unesco_core_zone',
            get_custom_features: () => [unesco_core_zone]
        },

        {
            name: 'bridge_areas',
            osm_feature_filter: f => f.properties?.man_made === 'bridge'
        },

        {
            name: 'land_areas',
            osm_feature_filter: f => {
                return land_areas_handmade_data.hasOwnProperty(f.id.toString())
            },
            props_to_add_to_osm_features: [
                {
                    name: 'area_type',
                    get_value: f => {
                        return land_areas_handmade_data[f.id.toString()]?.area_type || null
                    }
                },
                {
                    name: 'is_small_area',
                    get_value: f => {
                        return area(f.geometry) < 80000
                    }
                }
            ]
        }
    ]
}
