const fs = require('fs')
const path = require('path')
const turf = require('@turf/turf')

const centroids = {}

fs.readFile(
    path.join(__dirname, 'french_building.geojson'),
    'utf8',
    (_, data) => {
        const geojson = JSON.parse(data)
        geojson.forEach(feature => {
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