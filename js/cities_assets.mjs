import { land_areas_handmade_data } from "../dalat/static_data/handmade_data.mjs";
import { FIRST_CLASS_FRENCH_MINZOOM, MINOR_ROADS_MINZOOM } from "./layers/constants.mjs";
import { is_one_of } from "./utils/isomorphic_utils.mjs";

const major_road_highway_values = ['tertiary', "primary", "primary_link", "secondary", "trunk"]

export const cities_meta = {
    dalat: {

        // 10 is supposed to be a "global default" for now
        // So this is just to demonstrate that city can order another minzoom
        // That will affect e.g. the minzoom for tile generation
        // minzoom: 10,

        bounds: [108.3765, 11.8800, 108.5200, 12.0100],
        html_title: 'Map of colonial architecture in Dalat',
        intro_zoom: FIRST_CLASS_FRENCH_MINZOOM,
        unimportant_buildings_filter: feat => {
            return feat.properties['building:architecture'] !== 'french_colonial'
                && feat.id !== 1275206355 // big c
        },
        tile_layers: [
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
            },

            {
                name: 'transportation_other',
                feature_filter: f => f.properties?.aerialway === 'cable_car' || f.properties?.aerialway === 'gondola'
            },

            {
                name: 'lake',
                feature_filter: f => f.properties.natural === 'water'
                    && (f.properties.name === 'Hồ Xuân Hương'
                        || f.properties.name === 'Hồ Tuyền Lâm'
                        || f.properties.name === 'Hồ Chiến Thắng'
                        || f.properties.name === 'Hồ Đa Thiện'),
            },

            {
                name: 'river',
                feature_filter: f => f.properties.waterway === 'stream'
                    && f.id !== 99661185, // skip the stretch of Cam Ly "inside" the Lake
                feature_props_to_preserve: ['name', 'tunnel']
            },

            {
                name: 'land_areas',
                feature_filter: f => land_areas_handmade_data.hasOwnProperty(f.id.toString()),
                feature_props_to_preserve: ['landuse'],
                added_props: [{
                    name: 'area_type',
                    get_value: f => land_areas_handmade_data[f.id.toString()].area_type || null
                }]
            },
        ],
    },
    hue: {
        bounds: [107.5409, 16.4137, 107.6409, 16.5137], // given by ai
        html_title: 'Map of colonial architecture in Hue',
        unimportant_buildings_filter: feat => {
            return feat.properties['building:architecture'] !== 'french_colonial'
        },
        tile_layers: []
    }
}

export const load_city = async (name) => {
    current_city = {}
    current_city.bounds = cities_meta[name].bounds
    current_city.intro_zoom = cities_meta[name].intro_zoom || 12

    const [hmd] = await Promise.all([
        import(`../${name}/static_data/handmade_data.mjs`)
    ])
    current_city.all_handmade_data = hmd.all_handmade_data
}

export let current_city = null