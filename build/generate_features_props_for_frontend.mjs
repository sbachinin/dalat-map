import fs from 'fs'
import { mkdir_if_needed, parse_args } from './build_utils.mjs'
import * as turf from '@turf/turf'
import { is_feature_selectable } from '../js/utils/does_feature_have_details.mjs'
import { deep_merge_objects, get_centroid } from '../js/utils/isomorphic_utils.mjs'
globalThis.turf = turf

const { city } = parse_args()
const city_root_path = `../${city}`
const all_handmade_data = (await import(city_root_path + '/static_data/handmade_data.mjs')).all_handmade_data
const fids_to_img_names = (await import(city_root_path + '/static_data/fids_to_img_names.mjs')).fids_to_img_names
const ass = await import(city_root_path + '/assets_for_build.mjs')
const assets_for_build = ass.assets_for_build

const all_tiled_features = JSON.parse(
    fs.readFileSync(city_root_path + '/temp_data/features_to_generate_props_for.geojson', 'utf8')
)


// EXTRA: check that all contentful features have geojson
const all_contentful_features_ids = [...new Set(
    Object.keys(all_handmade_data)
        .concat(Object.keys(fids_to_img_names))
)]

all_contentful_features_ids.forEach(cfid => {
    if (!all_tiled_features.find(gjf => String(gjf.id) === String(cfid))) {
        console.warn(`There is some data for feature id ${cfid} but no such TILED geojson feature. Perhaps it's not meant to be tiled, and then it's ok.`)
    }
})

// 1. Generate generic (city-agnostic) props

const all_features_generic_props = {}

all_tiled_features.forEach(f => {
    if (!f.id) {
        console.log(f)
        process.exit(1)
    }

    if (f.geometry.type === 'Point') return

    const single_feature_props = {}

    if (is_feature_selectable(f.id, all_handmade_data, fids_to_img_names)) {
        single_feature_props.centroid = get_centroid(f)
    }

    if (f.properties.building
        && is_feature_selectable(f.id, all_handmade_data, fids_to_img_names)
        && turf.area(f) < 80
    ) {
        single_feature_props.is_small_building = true
    }

    all_features_generic_props[f.id] = single_feature_props
})

// 2. Generate city-specific props

const all_features_city_specific_props = assets_for_build.make_features_props_for_frontend?.(all_tiled_features) || {}

const result0 = deep_merge_objects(all_features_generic_props, all_features_city_specific_props)

const result = Object.fromEntries(
    Object.entries(result0)
        .filter(([_, f_props]) => Object.keys(f_props).length > 0)
)

const outputContent = `export const features_generated_props_for_frontend = ${JSON.stringify(result, null, 2)};`
mkdir_if_needed(city_root_path + '/generated_for_runtime')
fs.writeFileSync(city_root_path + '/generated_for_runtime/features_generated_props_for_frontend.mjs', outputContent)
console.log('Features props for frontend has been generated!')