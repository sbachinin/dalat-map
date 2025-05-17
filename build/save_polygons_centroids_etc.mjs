/* 
    Centroids are generated to fly to features.
    Currenly flying is possible only to the detailful ones,
    so centroids are made only for such.
    Also it's possible to use centroids to draw something instead of polygons,
        such as a "square" icon that accompanies a title of a building whose geometry is too early to show
*/

import fs from 'fs'
import * as turf from '@turf/turf'
import { get_title_side } from '../js/utils/isomorphic_utils.mjs'
import { is_feature_selectable, does_feature_have_title } from '../js/utils/does_feature_have_details.mjs'
import { mkdir_if_needed, parse_args } from './utils.mjs'


const result = {}

const { city } = parse_args()
const city_root_path = `../${city}`
const all_handmade_data = (await import(city_root_path + '/static_data/handmade_data.mjs')).all_handmade_data
const all_geojson_features = JSON.parse(
    fs.readFileSync(city_root_path + '/temp_data/all_geojson_features_with_renderables.geojson', 'utf8')
)

const get_all_lats = feature => {
    if (!feature?.geometry?.coordinates) {
        throw new Error("Invalid GeoJSON feature")
    }

    const { type, coordinates } = feature.geometry

    let all_lats = []

    if (type === "Polygon") {
        all_lats = coordinates[0].map(coord => coord[1])
    } else if (type === "MultiPolygon") {
        all_lats = coordinates.flat(2).map(coord => coord[1])
    } else {
        throw new Error("Geometry type must be Polygon or MultiPolygon")
    }

    return all_lats
}

const get_centroid = f => {
    const raw_centroid = turf.centerOfMass(f)
    return [
        Number(raw_centroid.geometry.coordinates[0].toFixed(6)),
        Number(raw_centroid.geometry.coordinates[1].toFixed(6))
    ]
}


const get_title_lat = (
    f // geojson feature
) => {
    if (f.title_coords) {
        return // title_coords will be taken at runtime, don't generate title lat
    }

    const title_side = get_title_side(f.id, all_handmade_data)
    if (title_side === null) {
        console.warn('Invalid title_side for feature', f.id)
        process.exit(1)
    }

    if (title_side === 'south') {
        return Math.min(...get_all_lats(f))
    } else if (title_side === 'north') {
        return Math.max(...get_all_lats(f))
    } else if (title_side === 'center') {
        return get_centroid(f)[1]
    }
}

Object.entries(all_handmade_data).forEach(([fid, f]) => {
    const geojson_feature = all_geojson_features.find(f => String(f.id) === String(fid))
    if (!geojson_feature) {
        console.warn('No geojson feature for this handmade id: ', fid)
        return
    }
    const is_selectable = is_feature_selectable(fid, all_handmade_data)
    const has_title = does_feature_have_title(fid, all_handmade_data)

    if (is_selectable) {
        result[fid] = {
            centroid: get_centroid(geojson_feature)
        }
    }

    if (has_title) {
        if (!f.title_coords) {
            result[fid] = {
                // ! If feature has title but isn't selectable, it still needs a centroid
                // because title lng will be taken from centroid
                centroid: get_centroid(geojson_feature),
                title_lat: get_title_lat(geojson_feature)
            }
        }
    }
})

const outputContent = `export const centroids_etc = ${JSON.stringify(result, null, 2)};`
mkdir_if_needed(city_root_path + '/generated_for_runtime')
fs.writeFileSync(city_root_path + '/generated_for_runtime/centroids_etc.mjs', outputContent)
console.log('centroids.mjs has been generated!')