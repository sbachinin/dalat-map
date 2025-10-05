import { all_handmade_data, land_areas_handmade_data as dalat_land_areas_handmade_data, lakes_handmade_data } from "./static_data/handmade_data.mjs"
import { get_centroid, is_building_polygon, is_one_of } from "../js/utils/isomorphic_utils.mjs"
import { map_bounds } from "./isomorphic_assets.mjs"
import { area } from "@turf/turf"
import { is_important_building } from "../js/utils/does_feature_have_details.mjs"
import { fids_to_img_names } from "./static_data/fids_to_img_names.mjs"
import * as custom_features from "./static_data/custom_features.mjs"

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

            if (f.properties['building:architecture'] === 'french_colonial' && f.geometry.type !== 'Point') {
                result[f.id] = {
                    // centroid is needed for french bldg even if it's not selectable because centroid is used to draw a building's circle at low z
                    centroid: get_centroid(f),
                    is_french: true
                }
            }
        })
        return result
    },

    tiling_config: [
        {
            name: 'boring_building',
            osm_feature_filter: f => {
                return is_building_polygon(f)
                    && f.properties['building:architecture'] !== 'french_colonial'
                    && f.id !== 1275206355 // big c
                    && !is_important_building(f.id, all_handmade_data, fids_to_img_names)
            }
        },
        {
            name: 'important_boring_building',
            osm_feature_filter: f => f.properties?.building
                && f.properties?.['building:architecture'] !== 'french_colonial'
                && is_important_building(f.id, all_handmade_data, fids_to_img_names),
        },
        {
            name: 'french_building',
            osm_feature_filter: f => f.properties['building:architecture'] === 'french_colonial',
            props_to_add_to_osm_features: ['has_title'],
        },

        {
            name: 'railway',
            osm_feature_filter: f => f.properties.railway === 'rail' || f.properties.railway === 'station',
        },

        {
            name: 'peaks'
        },

        {
            name: 'transportation_other',
            osm_feature_filter: f => is_one_of(f.properties.aerialway, [
                'gondola', 'cable_car', 'station'
            ]),
        },

        {
            name: 'water_areas',
            osm_feature_filter: f => f.properties.natural === 'water'
                && (f.properties.name === 'Hồ Xuân Hương'
                    || f.properties.name === 'Hồ Tuyền Lâm'
                    || f.properties.name === 'Hồ Chiến Thắng'
                    || f.properties.name === 'Hồ Đa Thiện'
                    || f.properties.name === 'Hồ Đan Kia'
                    || f.properties.name === 'Hồ Suối Vàng'
                ),
        },

        {
            name: 'river_lines',
            osm_feature_filter: f => (
                f.properties.waterway === 'stream' || f.properties.waterway === 'river'
            ) && f.id !== 99661185, // skip the stretch of Cam Ly "inside" the Lake
            props_to_add_to_osm_features: [{
                name: 'is_cam_ly',
                get_value: f => f.properties.name === 'Suối Cam Ly'
            }]
        },

        {
            name: 'land_areas',
            osm_feature_filter: f => {
                if (f.id === 1307493492) return false // not ana mandara
                return dalat_land_areas_handmade_data.hasOwnProperty(f.id.toString())
            },
            get_custom_features: () => [custom_features.lac_duong, custom_features.military_academy],
            props_to_add_to_osm_features: [
                {
                    name: 'area_type',
                    get_value: f => {
                        return dalat_land_areas_handmade_data[f.id.toString()]?.area_type || null
                    }
                },
                {
                    name: 'is_small_area',
                    get_value: f => {
                        return area(f.geometry) < 80000
                    }
                }
            ]
        },
    ]
}
