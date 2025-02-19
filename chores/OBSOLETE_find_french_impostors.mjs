import { readFile } from 'fs/promises'
import { pathToFileURL } from 'url'
import path from 'path'

const handmadeDataPath = path.resolve('../data/static/handmade_data.mjs')
const geojsonPath = path.resolve('../data/temp/french_building.geojson')

// THIS ANSWERS THE QUESTION:
// What bldgs I mistakenly added to french_bldgs_handmade_data whereas they are not french?

// OBSOLETE BECAUSE
// all bldgs data (french and not) were merged into one obj,
// so there is no question of frenchness in this unified obj

async function check_french_impostors() {
    try {
        const { french_bldgs_handmade_data } = await import(pathToFileURL(handmadeDataPath))

        const geojsonData = JSON.parse(await readFile(geojsonPath, 'utf-8'))

        const geojsonFeatureIds = new Set(geojsonData.map(f => f.id))

        const handmadeIds = Object.keys(french_bldgs_handmade_data).map(Number)
        const missingIds = handmadeIds.filter(id => {
            if (french_bldgs_handmade_data[id].dead === true) {
                // I'm assuming here that all dead are french...
                // Anyway dead are not present in osm data so comparison will not work
                return false
            }
            return !geojsonFeatureIds.has(id)
        })

        if (missingIds.length > 0) {
            console.log('Missing feature IDs from GeoJSON:', missingIds)
        } else {
            console.log('All handmade data entries are present in the GeoJSON.')
        }
    } catch (err) {
        console.error('Error:', err)
    }
}

check_french_impostors()
