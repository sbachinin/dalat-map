import { execSync } from 'child_process'
import fs from 'fs'
import {
    is_feature_selectable,
    does_feature_have_title
} from '../js/utils/does_feature_have_details.mjs'
import {
    calculate_minzoom,
    generate_id,
    is_real_number,
    mkdir_if_needed,
    parse_args,
    push_with_overwrite,
} from './build_utils.mjs'
import * as turf from '@turf/turf'
import { DEFAULT_MAX_ZOOM } from '../js/constants.mjs'
import { convert_link_roads } from './convert_link_roads.mjs'
import { roads_common_config, roads_hierarchy } from '../js/roads_config.mjs'
import { is_one_of } from '../js/utils/isomorphic_utils.mjs'
import { add_missing_tiling_props } from './tiling_common_config.mjs'
import { nonessential_feature_props } from './nonessential_feature_props.mjs'

globalThis.turf = turf

const write = (path, data) => {
    fs.writeFileSync(path, JSON.stringify(data, null, 2))
}

const exec = (command) => {
    execSync(command, { stdio: 'inherit' })
}


const { skip_osm_download, city: cityname } = parse_args()

const city_root_path = `../${cityname}`

if (!fs.existsSync(city_root_path)) {
    console.warn('no folder for such city: ', city_root_path)
    process.exit(1)
}

const ass = await import(city_root_path + '/assets_for_build.mjs')
const city_assets = ass.assets_for_build

mkdir_if_needed(city_root_path + `/temp_data`)

exec(`rm -f ${city_root_path}/temp_data/*.geojson`)

const osm_output_path = city_root_path + `/temp_data/output.osm`

if (!skip_osm_download) {
    exec(`rm -f ${osm_output_path}`)

    const bbox = city_assets.map_bounds.join(',')
    const url = `https://overpass-api.de/api/map?bbox=${bbox}`;
    exec(`curl -o ${osm_output_path} "${url}"`)
}

exec(`osmtogeojson ${osm_output_path} > ${city_root_path}/temp_data/from_osm.geojson`)










// "preprocess osm data"

const osm_geojson = JSON.parse(fs.readFileSync(city_root_path + '/temp_data/from_osm.geojson', 'utf-8'))

osm_geojson.features.forEach(f => {
    f.id = +f.id.replace(/^(way|node|relation)\//, '') // numberify the id, trim non-numeric part
})

convert_link_roads(osm_geojson.features)

osm_geojson.features.forEach(f => {
    if (f.geometry.type === 'LineString'
        && f.properties.highway
        && !roads_hierarchy.includes(f.properties.highway)
        && f.properties.highway !== 'construction'
        && f.properties.highway !== 'proposed'
    ) {
        console.warn('highway', f.properties.highway, 'not in roads_hierarchy')
    }
})



// i need to know the number of occurences of each feature property

const props_occurences = {}

osm_geojson.features.forEach(f => {
    Object.keys(f.properties).forEach(p => {
        props_occurences[p] = props_occurences[p] || 0
        props_occurences[p]++
    })
})


const temp_tiles_path = `../cities_tiles/temp`

const { all_handmade_data: hmdata } = await import(city_root_path + '/static_data/handmade_data.mjs')
const { fids_to_img_names } = await import(city_root_path + '/static_data/fids_to_img_names.mjs')

const clear_feature_props = (f) => {
    return {
        type: f.type,
        geometry: f.geometry,
        id: f.id,
        properties: Object.keys(f.properties)
            .filter(p => !nonessential_feature_props.includes(p) && !p.startsWith('name:'))
            .reduce((acc, p) => {
                acc[p] = f.properties[p]
                return acc
            }, {})
    }
}




const smallest_possible_minzoom = calculate_minzoom(city_assets.map_bounds, 320, 568)  // Assuming that smallest device (the one that will need the smallest minzoom) is Iphone SE

const all_mbtiles_paths = []

const generate_temp_mbtiles = (tile_layer_config, layer_features) => {
    const geojson_path = city_root_path + `/temp_data/${tile_layer_config.name}.geojson`

    if (layer_features.length === 0) { // otherwise tippecanoe fails at .geojson containing only empty array
        return
    }

    write(geojson_path,
        layer_features.map(clear_feature_props))

    const temp_tiles_city_path = `${temp_tiles_path}/${cityname}`
    mkdir_if_needed(temp_tiles_city_path)

    const temp_mbtiles_path = `${temp_tiles_city_path}/${tile_layer_config.name}.mbtiles`
    all_mbtiles_paths.push(temp_mbtiles_path)

    let minz = smallest_possible_minzoom
    if (is_real_number(tile_layer_config.minzoom)) {
        minz = Math.max(tile_layer_config.minzoom, smallest_possible_minzoom)
    }
    let maxz = DEFAULT_MAX_ZOOM
    if (is_real_number(tile_layer_config.maxzoom)) {
        maxz = Math.min(tile_layer_config.maxzoom, DEFAULT_MAX_ZOOM)
    }

    exec(`
        tippecanoe --quiet -o ${temp_mbtiles_path} \
        --minimum-zoom=${Math.floor(minz)} --maximum-zoom=${Math.floor(maxz)} \
        --no-tile-compression -f \
        --drop-rate=1 \
        ${geojson_path}`);
}



const i_ass = await import(city_root_path + '/isomorphic_assets.mjs')
const roads_config = { ...roads_common_config, ...i_ass.roads_config }
const roads_tiling_config = Object.entries(roads_config).map(([road_type_from, minzoom], i) => {
    const min_hier_index = roads_hierarchy.indexOf(road_type_from)

    let slice_to = roads_hierarchy.length
    if (Object.keys(roads_config)[i + 1]) {
        slice_to = roads_hierarchy.indexOf(Object.keys(roads_config)[i + 1])
    }

    const layer_road_types = roads_hierarchy.slice(min_hier_index, slice_to)
    return {
        name: 'roads_' + i,
        osm_feature_filter: f => f.geometry.type === 'LineString'
            && is_one_of(f.properties.highway, layer_road_types),
        minzoom: Number(minzoom)
    }
})



add_missing_tiling_props(city_assets.tiling_config)





// For each city's tile_layer:
// 1) tile_layer.osm_feature_filter will be executed for osm data
// 2) only features not listed in nonessential_feature_props will be kept
// 3) features specified in tile_layer.props_to_add_to_osm_features will be added to osm features
// 4) features made from tile_layer.get_custom_features will be added to osm features
// 5) temporary .mbtiles will be created for current layer's geojson
// (it's to enable individual minzooms for layers; then all .mbtiles are joined)
const all_tiled_features = city_assets.tiling_config
    .concat(roads_tiling_config)
    .flatMap(tile_layer_config => {
        if (!tile_layer_config.name) throw new Error('name not defined for tile_layer ' + tile_layer_config)

        if (!tile_layer_config.get_custom_features && !tile_layer_config.osm_feature_filter) {
            throw new Error('tile_layer must have either get_custom_features or osm_feature_filter defined, tile_layer name: ' + tile_layer_config.name)
        }

        let layer_features = []

        if (tile_layer_config.osm_feature_filter) {
            layer_features = osm_geojson.features
                .filter(tile_layer_config.osm_feature_filter)
                .map(f => {
                    tile_layer_config.props_to_add_to_osm_features?.forEach(prop => {
                        if (f.properties[prop] !== undefined) {
                            throw new Error(`trying to add extra prop "${prop}" to ${f.id} but feature already has it`)
                        }
                        if (prop === 'is_selectable') {
                            f.properties[prop] = is_feature_selectable(f.id, hmdata, fids_to_img_names)
                        } else if (prop === 'has_title') {
                            f.properties[prop] = does_feature_have_title(f.id, hmdata)
                        } else if (prop.name && prop.get_value) {
                            f.properties[prop.name] = prop.get_value(f, hmdata)
                        }
                    })
                    return f
                })
                // sort is just to get a more readable git diff, in case I want to track osm data changes, e.g. what french bldgs were removed
                .sort((a, b) => b.id - a.id)

        }


        if (tile_layer_config.get_custom_features) {
            // id has to be nothing or a number, otherwise error
            const custom_features = tile_layer_config.get_custom_features(osm_geojson.features)
                .map(f => {
                    if (typeof f.id === 'undefined') {
                        f.id = generate_id() // 1. generate id if missing. Otherwise, features without id can be erased later here
                    } else if (typeof f.id !== 'number') {
                        throw new Error('custom feature id must be a number, instead got ' + typeof f.id + ' ' + f.id)
                    }
                    return f
                })

            layer_features = push_with_overwrite(layer_features, custom_features)
        }

        generate_temp_mbtiles(tile_layer_config, layer_features)

        return layer_features
    })



write(
    city_root_path + '/temp_data/features_to_generate_props_for.geojson',
    all_tiled_features
)


const final_tiles_path = `../cities_tiles/${cityname}/tiles`
mkdir_if_needed(final_tiles_path)
exec(`rm -rf ${final_tiles_path}/*`)

exec(`
    tile-join -e ${final_tiles_path} \
    --no-tile-compression -f \
    ${all_mbtiles_paths.join(' ')}`);

exec(`rm -rf ${temp_tiles_path}/*`);
