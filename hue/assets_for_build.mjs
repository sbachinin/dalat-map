import * as turf from '@turf/turf'
import { map_bounds } from './isomorphic_assets.mjs'
import { assets_for_build as dalat_build_assets } from '../dalat/assets_for_build.mjs'
import { is_one_of } from '../js/utils/isomorphic_utils.mjs'
import { all_handmade_data, lakes_handmade_data, land_areas_handmade_data } from './static_data/handmade_data.mjs'
import { get_titles_points_tiling_settings } from '../build/titles_points.mjs'
import { unesco_sites_polygons } from './static_data/unesco_sites_polygons.mjs'
import imperial_city_border from './static_data/imperial_city_border.mjs'

const dalat_layers_to_use_in_hue = [
    'major_roads',
    'minor_roads',
    'peaks',
]

const hue_bulk_polygon = (await import('../hue/static_data/city_bulk_geometry.mjs')).default

const is_within_imperial_or_intersects = f => {
    let result = false
    try {
        // these turf fns tend to throw plenty of exceptions that are difficult to handle
        result = turf.booleanWithin(f, imperial_city_border)
            || turf.booleanIntersects(f, imperial_city_border)
    } catch (e) { }
    // So, if a building is within imperial but turf fails, building will be treated is outside imperial.
    // Slippery stuff. I only hope it will not fail on healthy buildings
    return result
}

export const assets_for_build = {
    map_bounds,
    html_title: 'Map of colonial architecture in Hue',
    unimportant_buildings_filter: f => {
        return f.properties['building:architecture'] !== 'french_colonial'
            && !is_within_imperial_or_intersects(f)
    },

    tile_layers_meta: dalat_build_assets.tile_layers_meta
        .filter(tl => is_one_of(tl.name, dalat_layers_to_use_in_hue))
        .concat([
            {
                name: 'non_french_bldgs_within_imperial_city',
                feature_filter: f => {
                    return f.properties.building
                        && f.geometry.type !== 'Point'
                        && f.properties['building:architecture'] !== 'french_colonial'
                        && is_within_imperial_or_intersects(f)
                }
            },
            {
                name: 'water_areas',
                feature_filter: f => {

                    if (is_one_of(f.id, [
                        205805271,
                        206625147,
                        242927543,
                        242927542,
                        1075011956,
                        3237013
                    ])) return true

                    if (is_one_of(f.id, [
                        217518615,
                        217518212,
                        251679819,
                        1166042173,
                        1125369216,
                        1125369215,
                        1125363332,
                        1125363328,
                        1125363330,
                        695959200,
                        695817661,
                        619851668,
                    ])) return false

                    if (f.id === 4928340932566945) return true // handmade lagoon
                    if (f.id === 492834093252947212) return true // sea

                    // rivers will be displayed even outside the city bulk
                    if (f.properties.water === 'river') return true

                    // other water areas will be displayed only if they are inside the city bulk
                    if (f.properties.water !== 'lake'
                        && f.properties.natural !== 'water'
                    ) return false
                    if (f.geometry.type === 'Polygon' && turf.booleanWithin(f, hue_bulk_polygon)) {
                        return true
                    }
                },
                added_props: [{
                    name: 'is_small_lake',
                    get_value: f => turf.area(f.geometry) < 20000
                        || is_one_of(f.id, [
                            // some parts of the ditch around vauban fort
                            39452865,
                            367388993,
                            39452851,
                            39452844,
                            39452850,

                            8537574
                        ])
                }]
            },
            {
                name: 'river_lines',
                feature_filter: f => (
                    f.properties.waterway === 'stream' || f.properties.waterway === 'river'
                ) && !is_one_of(f.id, [
                    371992465,
                    371992466,
                    371992467,
                    1384655151,
                    251682725,
                    371992489,
                    1384652981,
                    1384652982,
                    1384652980,
                    493391664,
                    493391669,
                    493391667,
                    493391668,
                    871598526,
                    695949067,
                    695959214
                ]),
                feature_props_to_preserve: ['name', 'tunnel']
            },
            {
                name: 'french_building',
                feature_filter: f => f.properties['building:architecture'] === 'french_colonial'
                    || f.id === 1384219085,
                added_props: ['is_selectable', 'has_title']
            },
            {
                name: 'city_walls_areas',
                feature_filter: f => {
                    if (f.properties.barrier === 'city_wall' && f.geometry.type === 'Polygon') return true
                }
            },
            {
                name: 'railway',
                feature_filter: f => f.properties.railway === 'rail' || f.properties.railway === 'station',
                feature_props_to_preserve: ['railway', 'name:en']
            },

            get_titles_points_tiling_settings(all_handmade_data, lakes_handmade_data),

            {
                name: 'land_areas',
                feature_filter: f => {
                    return land_areas_handmade_data.hasOwnProperty(f.id.toString())
                },
                added_props: [
                    {
                        name: 'area_type',
                        get_value: f => {
                            return land_areas_handmade_data[f.id.toString()]?.area_type || null
                        }
                    },
                    // {
                    //     name: 'is_small_area',
                    //     get_value: f => {
                    //         return turf.area(f.geometry) < 80000
                    //     }
                    // }
                ]
            },

            {
                name: 'unesco_areas',
                get_features: all_features => {
                    const polygons = unesco_sites_polygons
                        .concat(imperial_city_border)
                        .concat(all_features.filter(f => is_one_of(Number(f.id), [
                            174758160,
                            136815463,
                            136815456,
                            1346839222
                        ])))
                    const points = polygons.map(p => ({
                        ...turf.centerOfMass(p),
                        properties: { title: p.properties.title }
                    }))
                    return [...polygons, ...points]
                }
            }

        ]),
}
