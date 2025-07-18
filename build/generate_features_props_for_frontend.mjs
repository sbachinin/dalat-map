/* 
    Centroids are generated to fly to features.
    Currenly flying is possible only to the detailful ones,
    so centroids are made only for such.
    Also it's possible to use centroids to draw something instead of polygons,
        such as a "square" icon that accompanies a title of a building whose geometry is too early to show
*/

import fs from 'fs'
import { is_feature_selectable } from '../js/utils/does_feature_have_details.mjs'
import { mkdir_if_needed, parse_args } from './build_utils.mjs'
import * as turf from '@turf/turf'
import { get_centroid } from '../js/utils/isomorphic_utils.mjs'
globalThis.turf = turf

const { city } = parse_args()
const city_root_path = `../${city}`
const all_handmade_data = (await import(city_root_path + '/static_data/handmade_data.mjs')).all_handmade_data
const fids_to_img_names = (await import(city_root_path + '/static_data/fids_to_img_names.mjs')).fids_to_img_names

const all_geojson_features = JSON.parse(
    fs.readFileSync(city_root_path + '/temp_data/features_to_generate_props_for.geojson', 'utf8')
)


const result = {}
const all_contentful_features_ids = Object.keys(all_handmade_data).concat(Object.keys(fids_to_img_names))
all_contentful_features_ids.forEach(add_props_for_feature)

function add_props_for_feature(fid) {
    const geojson_feature = all_geojson_features.find(f => String(f.id) === String(fid))
    if (!geojson_feature) {
        console.warn('No geojson feature for this handmade id: ', fid)
        return
    }
    if (is_feature_selectable(fid, all_handmade_data, fids_to_img_names)) {
        result[fid] = {
            centroid: get_centroid(geojson_feature)
        }
    }
}

const outputContent = `export const features_generated_props_for_frontend = ${JSON.stringify(result, null, 2)};`
mkdir_if_needed(city_root_path + '/generated_for_runtime')
fs.writeFileSync(city_root_path + '/generated_for_runtime/features_generated_props_for_frontend.mjs', outputContent)
console.log('Features props for frontend has been generated!')