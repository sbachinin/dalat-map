import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import * as turf from '@turf/turf'
import dead_buildings_json from './static/dead_buildings_json.mjs'
import { buildings_handmade_data } from './static/buildings_handmade_data.mjs'

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

fs.readFile(
    path.join(__dirname, 'french_building.geojson'),
    'utf8',
    (_, alive_buildings_data) => {
        ([
            ...JSON.parse(alive_buildings_data),
            ...dead_buildings_json.features
        ]).forEach(feature => {
            const id = feature.id
            const geometry = feature.geometry

            if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
                const raw_centroid = turf.centroid(feature)
                data[id] = {
                    centroid: [
                        Number(raw_centroid.geometry.coordinates[0].toFixed(6)),
                        Number(raw_centroid.geometry.coordinates[1].toFixed(6))
                    ]
                }
                if (buildings_handmade_data[id]?.title) {
                    data[id].title_lat = get_southmost_lat(feature)
                }
            }
        });

        const outputContent = `export const centroids_etc = ${JSON.stringify(data, null, 2)};`

        fs.writeFileSync('centroids_etc.mjs', outputContent)

        console.log('centroids.mjs has been generated!')
    })