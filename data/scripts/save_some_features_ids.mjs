import fs from 'fs'

// TODO This better be merged with centroids etc to save kb

const french_data = JSON.parse(
    fs.readFileSync(
        '../temp/french_building.geojson',
        'utf8'
    )
)

const shit_data = JSON.parse(
    fs.readFileSync(
        '../temp/land_areas.geojson',
        'utf8'
    )
)

const french_ids = french_data.map(feature => feature.id).filter(id => id !== undefined)

const shit_ids = shit_data.map(feature => feature.id).filter(id => id !== undefined)

const outputContent = `export const french_ids = ${JSON.stringify(french_ids, null, 2)}
export const shit_ids = ${JSON.stringify(shit_ids, null, 2)}
`
fs.writeFileSync(
    '../for_runtime/bldgs_ids.mjs',
    outputContent
)
