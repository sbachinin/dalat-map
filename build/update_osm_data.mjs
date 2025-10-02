import { execSync } from 'child_process'
import { mkdir_if_needed } from './build_utils.mjs'

const exec = command => execSync(command, { stdio: 'inherit' })

export const update_osm_data = async (cityname) => {
    const city_root_path = `../${cityname}`
    const ass = await import(city_root_path + '/isomorphic_assets.mjs')
    
    const osm_output_path = city_root_path + `/temp_data/output.osm`
    exec(`rm -f ${osm_output_path}`)
    
    const bbox = ass.map_bounds.join(',')
    const url = `https://overpass-api.de/api/map?bbox=${bbox}`
    
    mkdir_if_needed(city_root_path + `/temp_data`)
    exec(`curl -o ${osm_output_path} "${url}"`)

    exec(`osmtogeojson ${osm_output_path} > ${city_root_path}/temp_data/all_from_osm.geojson`)
}
