import fs from 'fs'
import { mkdir_if_needed, parse_args } from './build_utils.mjs'
import * as turf from '@turf/turf'
globalThis.turf = turf

const { city } = parse_args()
const city_root_path = `../${city}`
const all_handmade_data = (await import(city_root_path + '/static_data/handmade_data.mjs')).all_handmade_data
const fids_to_img_names = (await import(city_root_path + '/static_data/fids_to_img_names.mjs')).fids_to_img_names
const ass = await import(city_root_path + '/assets_for_build.mjs')
const assets_for_build = ass.assets_for_build

const all_geojson_features = JSON.parse(
    fs.readFileSync(city_root_path + '/temp_data/features_to_generate_props_for.geojson', 'utf8')
)


// EXTRA: check that all contentful features have geojson
const all_contentful_features_ids = Object.keys(all_handmade_data).concat(Object.keys(fids_to_img_names))
all_contentful_features_ids.forEach(cfid => {
    if (!all_geojson_features.find(gjf => String(gjf.id) === String(cfid))) {
        console.warn(`There is some data for feature id ${cfid} but no such geojson feature`)
    }
})


const result = assets_for_build.make_features_props_for_frontend?.(all_geojson_features) || {}

const outputContent = `export const features_generated_props_for_frontend = ${JSON.stringify(result, null, 2)};`
mkdir_if_needed(city_root_path + '/generated_for_runtime')
fs.writeFileSync(city_root_path + '/generated_for_runtime/features_generated_props_for_frontend.mjs', outputContent)
console.log('Features props for frontend has been generated!')