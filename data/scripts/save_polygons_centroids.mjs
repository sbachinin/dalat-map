import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import * as turf from '@turf/turf'
import { all_handmade_data } from '../static/handmade_data.mjs'
import { get_title_side } from '../../js/utils/isomorphic_utils.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const data = {}

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

const feature_has_title = f => all_handmade_data[f.id]?.title




const alive_french_path = path.join(__dirname, '../temp/french_building.geojson')
const alive_buildings_json = fs.readFileSync(alive_french_path, 'utf8')
const dead_french_path = path.join(__dirname, '../static/dead_buildings.geojson')
const dead_buildings_json = fs.readFileSync(dead_french_path, 'utf8')
const all_french_buildings = [
    ...JSON.parse(alive_buildings_json),
    ...JSON.parse(dead_buildings_json)
]

const get_title_lat = (
    f // geojson feature
) => {
    if (f.title_coords) {
        return // title_coords will be taken at runtime, don't generate title lat
    }

    const title_side = get_title_side(f.id)
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

all_french_buildings.forEach(f => {
    /* 
        save centroids for all french bldgs in order to fly to selected ones
        TODO: Possibly can reduce the size of cntrds by taking only detailful ones
            (but first need to decide if only detailful are selectable)
    */
    data[f.id] = {
        centroid: get_centroid(f)
    }
    if (feature_has_title(f)) {
        data[f.id].title_lat = get_title_lat(f)
    }
})


const boring_path = path.join(__dirname, '../temp/boring_building.geojson')
// TODO this might be useless in case I decide to render boring titles at center
// (in such case titles can be rendered from polygon features)
// It depends also on how I solve the titles priority order (this might necessitate having all titles as separate entities)
const boring_buildings_data = fs.readFileSync(boring_path, 'utf8')
JSON.parse(boring_buildings_data)
    .filter(feature_has_title)
    .forEach(f => {
        data[f.id] = {
            centroid: get_centroid(f),
            title_lat: get_title_lat(f)
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