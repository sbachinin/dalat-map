import { execSync } from 'child_process'
import fs from 'fs'
import {
    is_feature_selectable,
    does_feature_have_title
} from '../js/utils/does_feature_have_details.mjs'
import {
    calculate_minzoom,
    generate_id,
    getArrayDepth,
    import_from_all_mjs_files,
    is_real_number,
    mkdir_if_needed,
    parse_args,
    remove_duplicates_by_id,
} from './build_utils.mjs'
import * as turf from '@turf/turf'
import { DEFAULT_MAX_ZOOM } from '../js/constants.mjs'
import { convert_link_roads } from './convert_link_roads.mjs'
import { roads_common_config, roads_hierarchy } from '../js/roads_config.mjs'
import { is_one_of } from '../js/utils/isomorphic_utils.mjs'
import { add_missing_tiling_props } from './tiling_common_config.mjs'
import { nonessential_feature_props } from './nonessential_feature_props.mjs'
import { make_title_point_feature } from './titles_points.mjs'

globalThis.turf = turf

const write = (path, data) => {
    fs.writeFileSync(path, JSON.stringify(data, null, 2))
}

const exec = (command) => {
    execSync(command, { stdio: 'inherit' })
}


const { city: cityname } = parse_args()

const city_root_path = `../${cityname}`

if (!fs.existsSync(city_root_path)) {
    console.warn('no folder for such city: ', city_root_path)
    process.exit(1)
}


const { all_handmade_data } = await import(city_root_path + '/static_data/handmade_data.mjs')
const { fids_to_img_names } = await import(city_root_path + '/static_data/fids_to_img_names.mjs')
const i_ass = await import(city_root_path + '/isomorphic_assets.mjs')
const ass = await import(city_root_path + '/assets_for_build.mjs')
const city_assets = ass.assets_for_build

mkdir_if_needed(city_root_path + `/temp_data/topical`)

exec(`rm -f ${city_root_path}/temp_data/topical/*.geojson`)











// "preprocess osm data"

const osm_geojson = JSON.parse(fs.readFileSync(city_root_path + '/temp_data/all_from_osm.geojson', 'utf-8'))

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
        && f.properties.highway !== '*'
    ) {
        console.warn('highway', f.properties.highway, 'not in roads_hierarchy, perhaps it must be included?')
    }
})


const temp_tiles_path = `../cities_tiles/temp`

globalThis.current_city = { all_handmade_data, fids_to_img_names }

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

const generate_temp_mbtiles = (layer) => {
    if (!layer.config) {
        debugger
    }
    const geojson_path = city_root_path + `/temp_data/topical/${layer.config.name}.geojson`

    if (layer.features.length === 0) { // otherwise tippecanoe fails at .geojson containing only empty array
        return
    }

    write(geojson_path,
        layer.features.map(clear_feature_props))

    const temp_tiles_city_path = `${temp_tiles_path}/${cityname}`
    mkdir_if_needed(temp_tiles_city_path)

    const temp_mbtiles_path = `${temp_tiles_city_path}/${layer.config.name}.mbtiles`
    all_mbtiles_paths.push(temp_mbtiles_path)

    let minz = smallest_possible_minzoom
    if (is_real_number(layer.config.minzoom)) {
        minz = Math.max(layer.config.minzoom, smallest_possible_minzoom)
    }
    let maxz = i_ass.max_zoom || DEFAULT_MAX_ZOOM
    if (is_real_number(layer.config.maxzoom)) {
        maxz = Math.min(layer.config.maxzoom, maxz)
    }

    exec(`
        tippecanoe --quiet -o ${temp_mbtiles_path} \
        --minimum-zoom=${Math.floor(minz)} --maximum-zoom=${Math.floor(maxz)} \
        --no-tile-compression -f \
        --drop-rate=1 \
        ${geojson_path}`);
}



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
const layers = {};


// generate layer for each .mjs file in custom_features_for_tiling/
const modules = await import_from_all_mjs_files(city_root_path + '/static_data/custom_buildings_geometries_for_tiling')

const custom_features_tiling_config = modules.map(({ file, module }) => {
    const get_custom_features = () => {
        return Object.entries(module.default).map(([id, fdata]) => {
            const depth = getArrayDepth(fdata)
            if (depth < 3) throw new Error('Custom building geometry must have depth >= 3 (only polygon or multi). Id: ' + id)
            const ftype = depth === 3 ? 'Polygon' : 'MultiPolygon'
            return {
                id: Number(id),
                type: 'Feature',
                geometry: {
                    type: ftype,
                    coordinates: fdata
                },
                properties: {
                    building: 'custom' // could be just 'true'
                }
            }
        })
    }
    return {
        name: file.split('.')[0],
        get_custom_features
    }
});


([
    ...city_assets.tiling_config,
    ...roads_tiling_config,
    ...custom_features_tiling_config
]).forEach(tile_layer_config => {
    if (!tile_layer_config.name) throw new Error('name not defined for tile_layer ' + tile_layer_config)

    if (!tile_layer_config.get_custom_features && !tile_layer_config.osm_feature_filter) {
        throw new Error('tile_layer must have either get_custom_features or osm_feature_filter defined, tile_layer name: ' + tile_layer_config.name)
    }

    let filtered_osm_features = []
    if (tile_layer_config.osm_feature_filter) {
        filtered_osm_features = osm_geojson.features
            .filter(tile_layer_config.osm_feature_filter)
            .map(f => {
                tile_layer_config.props_to_add_to_osm_features?.forEach(extra_prop => {
                    if (f.properties[extra_prop] !== undefined) {
                        throw new Error(`trying to add extra prop "${extra_prop}" to ${f.id} but feature already has it`)
                    }
                    if (extra_prop.name && extra_prop.get_value) {
                        f.properties[extra_prop.name] = extra_prop.get_value(f, all_handmade_data)
                    }
                })

                return f
            })
            // sort is just to get a more readable git diff, in case I want to track osm data changes, e.g. what french bldgs were removed
            .sort((a, b) => b.id - a.id)

    }

    let custom_features = []
    if (tile_layer_config.get_custom_features) {
        // id has to be nothing or a number, otherwise error
        custom_features = tile_layer_config.get_custom_features(osm_geojson.features)
            .map(f => {
                if (typeof f.id === 'undefined') {
                    f.id = generate_id() // 1. generate id if missing. Otherwise, features without id can be erased later here
                } else if (typeof f.id !== 'number') {
                    throw new Error(`custom feature id must be a number, instead got ${typeof f.id} ${f.id}`)
                }
                return f
            })
    }

    let layer_features = [
        ...filtered_osm_features,
        ...custom_features,
    ]

    layer_features.forEach(f => {
        if (is_feature_selectable(f.id)) {
            f.properties.is_selectable = true
        }

        if (does_feature_have_title(f.id)) {
            f.properties.has_title = true
        }

        const area_type = all_handmade_data[f.id]?.area_type
        if (area_type) {
            f.properties.area_type = area_type
        }

        if (i_ass.is_building_historic(f)) {
            f.properties.is_historic = true
        }
    })

    layer_features = remove_duplicates_by_id(layer_features) // take only last feature with the same id => custom feature wins

    // * (this overwrites previously written layer with same name)
    // So, it there is a file custom_features_for_tiling/dead_buildings,
    // + 'dead_buildings' entry in tiling_config, the second will prevail
    layers[tile_layer_config.name] = {
        config: tile_layer_config,
        features: layer_features,
    }
})

Object.values(layers).forEach(generate_temp_mbtiles)

const all_tiled_features = Object.values(layers).flatMap(l => l.features)

write(
    city_root_path + '/temp_data/features_to_generate_props_for.geojson',
    all_tiled_features
)


const polygons_titles_points_feats = all_tiled_features
    .filter(f => f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon')
    .filter(f => Boolean(all_handmade_data[f.id]?.title) || f.properties?.title)
    .map(f => make_title_point_feature(f, all_handmade_data))

generate_temp_mbtiles({
    config: { name: 'polygons_titles_points' },
    features: polygons_titles_points_feats
})



generate_temp_mbtiles({
    config: { name: 'selectable_polygons' },
    features: all_tiled_features
        .filter(f => is_feature_selectable(f.id))
})


const final_tiles_path = `../cities_tiles/${cityname}/tiles`
mkdir_if_needed(final_tiles_path)
exec(`rm -rf ${final_tiles_path}/*`)

exec(`
    tile-join -e ${final_tiles_path} \
    --no-tile-compression -f \
    ${all_mbtiles_paths.join(' ')}`);

exec(`rm -rf ${temp_tiles_path}/*`);
