import { all_handmade_data, land_areas_handmade_data as dalat_land_areas_handmade_data, lakes_handmade_data } from "./static_data/handmade_data.mjs";
import { AREA_TYPES, MINOR_ROADS_MINZOOM } from "../js/common_drawing_layers/constants.mjs";
import { is_one_of } from "../js/utils/isomorphic_utils.mjs";
import { map_bounds } from "./isomorphic_assets.mjs"
import { area } from "@turf/turf";
import { get_titles_points_tiling_settings } from "../js/utils/titles_points.mjs"

const major_road_highway_values = ['tertiary', "primary", "primary_link", "secondary", "trunk", "motorway"]

export const assets_for_build = {
    map_bounds,
    html_title: 'Map of colonial architecture in Dalat',
    unimportant_buildings_filter: feat => {
        return feat.properties['building:architecture'] !== 'french_colonial'
            && feat.id !== 1275206355 // big c
    },
    tile_layers_meta: [
        {
            name: 'french_building',
            feature_filter: f => f.properties['building:architecture'] === 'french_colonial',
            added_props: ['is_selectable', 'has_title']
        },
        {
            name: 'major_roads',
            feature_filter: f => is_one_of(f.properties.highway, major_road_highway_values),
            feature_props_to_preserve: ['highway']
        },

        {
            name: 'minor_roads',
            feature_filter: f => f.properties.highway
                && !is_one_of(f.properties.highway, major_road_highway_values),
            feature_props_to_preserve: ['highway'],
            minzoom: MINOR_ROADS_MINZOOM
        },

        {
            name: 'railway',
            feature_filter: f => f.properties.railway === 'rail' || f.properties.railway === 'station',
            feature_props_to_preserve: ['railway']
        },

        {
            name: 'peaks',
            feature_filter: f => f.properties.natural === 'peak',
            feature_props_to_preserve: ['ele'],
            minzoom: 11
        },

        {
            name: 'transportation_other',
            feature_filter: f => is_one_of(f.properties.aerialway, [
                'gondola', 'cable_car', 'station'
            ]),
            feature_props_to_preserve: ['aerialway'],
        },

        {
            name: 'water_areas',
            feature_filter: f => f.properties.natural === 'water'
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
            feature_filter: f => (
                f.properties.waterway === 'stream' || f.properties.waterway === 'river'
            ) && f.id !== 99661185, // skip the stretch of Cam Ly "inside" the Lake
            feature_props_to_preserve: ['name', 'tunnel']
        },

        {
            name: 'land_areas',
            feature_filter: f => {
                if (f.properties.name === 'Lac Duong') return true
                if (f.id === 1307493492) return false // not ana mandara
                return dalat_land_areas_handmade_data.hasOwnProperty(f.id.toString())
            },
            added_props: [
                {
                    name: 'area_type',
                    get_value: f => {
                        if (f.properties.name === 'Lac Duong') return AREA_TYPES.TOWN
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

        get_titles_points_tiling_settings(all_handmade_data, lakes_handmade_data),

    ]
}
