/* 
    Centroids are generated to fly to features.
    Currenly flying is possible only to the detailful ones,
    so centroids are made only for such.
    Also it's possible to use centroids to draw something instead of polygons,
        such as a "square" icon that accompanies a title of a building whose geometry is too early to show
*/

import fs from 'fs'
import { is_feature_selectable } from '../js/utils/does_feature_have_details.mjs'
import { mkdir_if_needed, parse_args } from './utils.mjs'
import { get_centroid } from './get_centroid.mjs'
import * as turf from '@turf/turf'

// TODO
// Currently this is just centroids, not centroids_etc, so rename is desirable
// Also, returned items could be just centroids ([]), not objects. But not a big deal

global.turf = turf

const result = {}

const { city } = parse_args()
const city_root_path = `../${city}`
const all_handmade_data = (await import(city_root_path + '/static_data/handmade_data.mjs')).all_handmade_data
const all_geojson_features = JSON.parse(
    fs.readFileSync(city_root_path + '/temp_data/all_geojson_features_with_renderables.geojson', 'utf8')
)


Object.entries(all_handmade_data).forEach(([fid, f]) => {
    const geojson_feature = all_geojson_features.find(f => String(f.id) === String(fid))
    if (!geojson_feature) {
        console.warn('No geojson feature for this handmade id: ', fid)
        return
    }
    if (is_feature_selectable(fid, all_handmade_data)) {
        result[fid] = {
            centroid: get_centroid(geojson_feature)
        }
    }
})

const outputContent = `export const centroids_etc = ${JSON.stringify(result, null, 2)};`
mkdir_if_needed(city_root_path + '/generated_for_runtime')
fs.writeFileSync(city_root_path + '/generated_for_runtime/centroids_etc.mjs', outputContent)
console.log('centroids.mjs has been generated!')