import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import * as turf from '@turf/turf'
import dead_buildings_json from '../static/dead_buildings_json.mjs'
import { all_handmade_data } from '../static/handmade_data.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const data = {}

function get_southmost_lat(feature) {
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

    return Math.min(...all_lats)
}

const get_centroid = f => {
    const raw_centroid = turf.centerOfMass(f)
    return [
        Number(raw_centroid.geometry.coordinates[0].toFixed(6)),
        Number(raw_centroid.geometry.coordinates[1].toFixed(6))
    ]
}

const feature_has_title = f => all_handmade_data[f.id]?.title




const alive_french_path = path.join(__dirname, '../temp/french_building.geojson')
const alive_buildings_data = fs.readFileSync(alive_french_path, 'utf8');
([
    ...JSON.parse(alive_buildings_data),
    ...dead_buildings_json.features
]).forEach(f => {
    data[f.id] = {
        centroid: get_centroid(f)
    }
    if (feature_has_title(f)) {
        data[f.id].title_lat = get_southmost_lat(f)
    }
})


const boring_path = path.join(__dirname, '../temp/boring_building.geojson')
const boring_buildings_data = fs.readFileSync(boring_path, 'utf8')
JSON.parse(boring_buildings_data)
    .filter(feature_has_title)
    .forEach(f => {
        data[f.id] = {
            centroid: get_centroid(f),
            title_lat: get_southmost_lat(f)
        }
    })

const land_areas_path = path.join(__dirname, '../temp/land_areas.geojson')
const land_areas_data = fs.readFileSync(land_areas_path, 'utf8')
JSON.parse(land_areas_data)
    .filter(feature_has_title)
    .forEach(f => {
        data[f.id] = {
            centroid: get_centroid(f),
            title_lat: get_centroid(f)[1] // because areas titles are in the center, not under
        }
    })

const outputContent = `export const centroids_etc = ${JSON.stringify(data, null, 2)};`
fs.writeFileSync('../for_runtime/centroids_etc.mjs', outputContent)
console.log('centroids.mjs has been generated!')