import fs from 'fs'

export const save_buildings_props_for_frontend = async (cityname) => {
    const city_root_path = `../${cityname}`

    const buildings_handmade_data = (await import(city_root_path + '/static_data/handmade_data.mjs')).buildings_handmade_data
    const fids_to_img_names = (await import(city_root_path + '/static_data/fids_to_img_names.mjs')).fids_to_img_names
    const all_contentful_features_ids = [...new Set(
        Object.keys(buildings_handmade_data)
            .concat(Object.keys(fids_to_img_names))
    )].map(Number)

    const osm_geojson = JSON.parse(fs.readFileSync(city_root_path + '/temp_data/all_from_osm.geojson', 'utf-8'))

    const props = {}

    osm_geojson.features.forEach(f => {
        const numid = parseInt(f.id.split("/")[1], 10)
        if (all_contentful_features_ids.includes(numid)) {
            if (f.geometry.type !== 'Polygon') {
                console.log('Handmade building id was matched to a non-polygon osm feature!', numid)
                return
            }
            props[numid] = {
                polygon: f.geometry.coordinates
            }
        }
    })

    fs.writeFileSync(
        city_root_path + '/generated_for_runtime/contentful_buildings_props_from_osm.mjs',
        `export const contentful_buildings_props_from_osm = ${JSON.stringify(props, null, 2)};`)
}