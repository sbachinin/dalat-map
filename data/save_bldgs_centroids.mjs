import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import * as turf from '@turf/turf'
import dead_buildings_json from './static/dead_buildings_json.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const centroids = {}

fs.readFile(
    path.join(__dirname, 'french_building.geojson'),
    'utf8',
    (_, live_buildings_data) => {
        ([
            ...JSON.parse(live_buildings_data),
            ...dead_buildings_json.features
        ]).forEach(feature => {
            const id = feature.id
            const geometry = feature.geometry

            if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
                const centroid = turf.centroid(feature)
                centroids[id] = [
                    Number(centroid.geometry.coordinates[0].toFixed(6)),
                    Number(centroid.geometry.coordinates[1].toFixed(6))
                ]
            }
        });

        const outputContent = `export const centroids = ${JSON.stringify(centroids, null, 2)};`

        fs.writeFileSync('centroids.mjs', outputContent)

        console.log('centroids.mjs has been generated!')
    })