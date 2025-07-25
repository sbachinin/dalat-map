import { execSync } from 'child_process'
import fs from 'fs'
import {
    is_feature_selectable,
    does_feature_have_title
} from '../js/utils/does_feature_have_details.mjs'
import {
    BORING_BLDGS_POLYGONS_MINZOOM
} from '../js/common_drawing_layers/constants.mjs'
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










const boring_building_tiling_meta = {
    name: 'boring_building',
    feature_filter: f => {
        if (!f.properties?.building) return false
        if (f.geometry.type === 'Point') return false
        const cf = city_assets.unimportant_buildings_filter
        if (cf) return cf(f)
        return false
    },
    feature_props_to_preserve: ['building', 'building:architecture'],
    minzoom: BORING_BLDGS_POLYGONS_MINZOOM
}










// merge custom_features.geojson into osm geojson,
// and bulk geometry (as polygon + as linestring) too,
// prioritize custom features in case of duplicate ids

const osm_features = JSON.parse(fs.readFileSync(city_root_path + '/temp_data/from_osm.geojson', 'utf-8')).features
const custom_features_path = city_root_path + '/static_data/custom_features.geojson'
const custom_features = fs.existsSync(custom_features_path)
    ? JSON.parse(fs.readFileSync(custom_features_path, 'utf-8')).features
    : []

const fix_id = f => {
    if (!f.id) {
        // 1. generate id if missing. Otherwise, features without id can be erased later here
        f.id = generate_id()
    } else {
        // 2. numberify the id, trim non-numeric part
        f.id = +f.id.replace(/^(way|node|relation)\//, '')
    }
    return f
}

const seen_ids = new Set()
const is_not_duplicate = f => { // because custom features may repeat the osm data
    if (seen_ids.has(f.id)) {
        console.warn('duplicate id', f.id)
        return false
    }
    seen_ids.add(f.id)
    return true
}

let main_geojson = {
    type: 'FeatureCollection',
    features: custom_features
        .concat(osm_features)
        .map(fix_id)
        .filter(is_not_duplicate)
}





const temp_tiles_path = `../cities_tiles/temp`

const { all_handmade_data: hmdata } = await import(city_root_path + '/static_data/handmade_data.mjs')
const { fids_to_img_names } = await import(city_root_path + '/static_data/fids_to_img_names.mjs')

const clear_feature_props = (feature, tile_layer) => {
    const properties = {}

    const preserved_props_names = tile_layer.feature_props_to_preserve || []

    if (Array.isArray(tile_layer.added_props)) {
        // prop is either an object with a .name, or a string...
        const added_props_names = tile_layer.added_props.map(p => p.name || p)
        preserved_props_names.push(...added_props_names)
    }

    preserved_props_names.forEach(n => {
        properties[n] = feature.properties[n]
    })

    return {
        type: feature.type,
        geometry: feature.geometry,
        id: feature.id,
        properties
    }
}




const smallest_possible_minzoom = calculate_minzoom(city_assets.map_bounds, 320, 568)  // Assuming that smallest device (the one that will need the smallest minzoom) is Iphone SE

const all_mbtiles_paths = []

const generate_temp_mbtiles = (
    tile_layer_name,
    layer_features,
    tile_layer_minzoom,
    tile_layer_maxzoom
) => {
    const geojson_path = city_root_path + `/temp_data/${tile_layer_name}.geojson`

    if (layer_features.length === 0) { // otherwise tippecanoe fails at .geojson containing only empty array
        return
    }

    write(geojson_path, layer_features)

    const temp_tiles_city_path = `${temp_tiles_path}/${cityname}`
    mkdir_if_needed(temp_tiles_city_path)

    const temp_mbtiles_path = `${temp_tiles_city_path}/${tile_layer_name}.mbtiles`
    all_mbtiles_paths.push(temp_mbtiles_path)

    let minz = smallest_possible_minzoom
    if (is_real_number(tile_layer_minzoom)) {
        minz = Math.max(tile_layer_minzoom, smallest_possible_minzoom)
    }
    let maxz = DEFAULT_MAX_ZOOM
    if (is_real_number(tile_layer_maxzoom)) {
        maxz = Math.min(tile_layer_maxzoom, DEFAULT_MAX_ZOOM)
    }

    exec(`
        tippecanoe --quiet -o ${temp_mbtiles_path} \
        --minimum-zoom=${Math.floor(minz)} --maximum-zoom=${Math.floor(maxz)} \
        --no-tile-compression -f \
        --drop-rate=1 \
        ${geojson_path}`);
}








// For each city's tile_layer:
// 1) tile_layer.feature_filter will be executed for ALL data
// 2) only features specified in tile_layer.feature_props_to_preserve will be preserved
// 3) features specified in tile_layer.added_props will be added
// 4) result will be written
// 5) temporary .mbtiles will be created for current layer's geojson
// (it's to enable individual minzooms for layers; then all .mbtiles are joined)
city_assets.tile_layers_meta
    .concat(boring_building_tiling_meta)
    .forEach(tile_layer => {
        if (!tile_layer.name) throw new Error('name not defined for tile_layer ' + tile_layer)

        let layer_features = null
        if (tile_layer.get_features) {
            layer_features = tile_layer.get_features(main_geojson.features).map(f => ({ ...f, id: f.id || generate_id() }))
            main_geojson.features = push_with_overwrite(main_geojson.features, layer_features)
        } else if (tile_layer.feature_filter) {
            layer_features = main_geojson.features
                .filter(tile_layer.feature_filter)
                .map(f => {
                    tile_layer.added_props?.forEach(prop => {
                        if (f.properties[prop] !== undefined) {
                            throw new Error(`trying to add extra prop ${prop} to ${f.id} but feature already has it`)
                        }
                        if (prop === 'is_selectable') {
                            f.properties[prop] = is_feature_selectable(f.id, hmdata, fids_to_img_names)
                        } else if (prop === 'has_title') {
                            f.properties[prop] = does_feature_have_title(f.id, hmdata)
                        } else if (prop.name && prop.get_value) {
                            f.properties[prop.name] = prop.get_value(f)
                        }
                    })
                    return f
                })
                .map(f => clear_feature_props(f, tile_layer))
                .map(tile_layer.feature_transform || (f => f))
                // sort is just to get a more readable git diff, in case I want to track osm data changes, e.g. what french bldgs were removed
                .sort((a, b) => b.id - a.id)

        } else {
            throw new Error('tile_layer must have either get_features or feature_filter defined, tile_layer name: ' + tile_layer.name)
        }

        generate_temp_mbtiles(
            tile_layer.name,
            layer_features,
            tile_layer.minzoom,
            tile_layer.maxzoom
        )
    })



write(
    city_root_path + '/temp_data/features_to_generate_props_for.geojson',
    main_geojson.features
)


const final_tiles_path = `../cities_tiles/${cityname}/tiles`
mkdir_if_needed(final_tiles_path)
exec(`rm -rf ${final_tiles_path}/*`)

exec(`
    tile-join -e ${final_tiles_path} \
    --no-tile-compression -f \
    ${all_mbtiles_paths.join(' ')}`);

exec(`rm -rf ${temp_tiles_path}/*`);
