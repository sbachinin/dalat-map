/* 
    Centroids are generated to fly to features.
    Currenly flying is possible only to the detailful ones,
    so centroids are made only for such.
    Also it's possible to use centroids to draw something instead of polygons,
        such as a "square" icon that accompanies a title of a building whose geometry is too early to show
*/

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import * as turf from '@turf/turf'
import { get_title_side } from '../../js/utils/isomorphic_utils.mjs'
import { is_feature_selectable, does_feature_have_title } from '../../js/utils/does_feature_have_details.mjs'
import { all_handmade_data } from '../../dalat/static_data/handmade_data.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const result = {}


const alive_french_path = path.join(__dirname, '../temp/french_building.geojson')
const alive_buildings_json = fs.readFileSync(alive_french_path, 'utf8')
const dead_french_path = path.join(__dirname, '../static/dead_buildings.geojson')
const dead_buildings_json = fs.readFileSync(dead_french_path, 'utf8')
const boring_path = path.join(__dirname, '../temp/boring_building.geojson')
const boring_buildings_data = fs.readFileSync(boring_path, 'utf8')
const land_areas_path = path.join(__dirname, '../temp/land_areas.geojson')
const land_areas_data = fs.readFileSync(land_areas_path, 'utf8')


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
    
    // TODO
    throw new Error('This needs to be city-agnostic, accepting a city name and retrieving the appropriate hmdata')

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


([...JSON.parse(land_areas_data),
...JSON.parse(boring_buildings_data),
...JSON.parse(alive_buildings_json),
...JSON.parse(dead_buildings_json)
]).forEach(f => {
    if (is_feature_selectable(f.id) || does_feature_have_title(f.id)) {
        result[f.id] = {
            centroid: get_centroid(f),
            title_lat: get_title_lat(f)
        }
    }
})

const outputContent = `export const centroids_etc = ${JSON.stringify(result, null, 2)};`
fs.writeFileSync('../generated_for_runtime/centroids_etc.mjs', outputContent)
console.log('centroids.mjs has been generated!')