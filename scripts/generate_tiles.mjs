import { execSync } from 'child_process'
import fs from 'fs'
import {
    is_feature_selectable,
    does_feature_have_title
} from '../js/utils/does_feature_have_details.mjs'
import {
    BORING_BLDGS_POLYGONS_MINZOOM,
    DEFAULT_CITY_MINZOOM
} from '../js/layers/constants.mjs'
import { maybe_import_default, mkdir_if_needed, parse_args } from './utils.mjs'
import * as turf from '@turf/turf'

global.turf = turf

const write = (path, data) => {
    fs.writeFileSync(path, JSON.stringify(data, null, 2))
}

const exec = (command) => {
    execSync(command, { stdio: 'inherit' })
}


const { skip_osm_download, city } = parse_args()

const city_root_path = `../${city}`
const city_assets = (await import(city_root_path + '/all_assets.mjs')).all_assets

if (!fs.existsSync(city_root_path)) {
    console.warn('no folder for such city: ', city_root_path)
    process.exit(0)
}

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
    added_props: ['is_selectable', 'has_title'],
    feature_props_to_preserve: ['building', 'building:architecture'],
    minzoom: BORING_BLDGS_POLYGONS_MINZOOM
}

const general_tile_layers = [boring_building_tiling_meta]










const custom_features = []

const custom_features_path = city_root_path + '/static_data/custom_features.geojson'
if (fs.existsSync(custom_features_path)) {
    custom_features.push(
        ...JSON.parse(fs.readFileSync(custom_features_path, 'utf-8'))
            .features.map(f => ({
                ...f,
                // without SOME id feature might not survive some future transformations in this script
                id: f.id || Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
            }))
    )
}


let bulk_polygon = await maybe_import_default(
    city_root_path + '/static_data/city_bulk_geometry.mjs')

if (bulk_polygon) {
    const CITY_BULK_POLYGON_ID = 9345734095734957
    const CITY_BULK_LINESTRING_ID = 9345734095734958

    const bulk_linestring = {
        type: 'Feature',
        properties: bulk_polygon.properties,
        geometry: {
            type: 'LineString',
            coordinates: bulk_polygon.geometry.coordinates[0],
        }
    }

    custom_features.push({ ...bulk_polygon, id: CITY_BULK_POLYGON_ID })
    custom_features.push({ ...bulk_linestring, id: CITY_BULK_LINESTRING_ID })

    general_tile_layers.push({
        name: 'city_bulk_geometry',
        feature_filter: f => f.id === CITY_BULK_POLYGON_ID || f.id === CITY_BULK_LINESTRING_ID
    })
}





const osm_data = JSON.parse(fs.readFileSync(city_root_path + '/temp_data/from_osm.geojson', 'utf-8'))
let all_geojson = osm_data


// merge custom_features.geojson into osm geojson,
// and bulk geometry (as polygon + as linestring) too,
// prioritize custom features in case of duplicate ids
const seen_ids = new Set()
let features = osm_data.features
    .concat(custom_features)
    .reverse()
    .filter(feature => {
        if (!feature.id || seen_ids.has(feature.id)) return false
        seen_ids.add(feature.id)
        return true
    }).reverse()

all_geojson = { type: 'FeatureCollection', features }









// DROP NON-NUMERIC PART OF FEATURE ID SUCH AS "way/"
all_geojson.features = all_geojson.features
    .map(feature => {
        if (typeof feature.id === 'string') {
            feature.id = feature.id.replace(/^(way|node|relation)\//, '')
            feature.id = Number(feature.id)
        }
        return feature
    })







const temp_tiles_path = `../cities_tiles/temp`

const { all_handmade_data: hmdata } = await import(city_root_path + '/static_data/handmade_data.mjs')

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








const all_mbtiles_paths = []

const generate_temp_mbtiles = (tile_layer_name, minzoom, layer_features) => {

    const geojson_path = city_root_path + `/temp_data/${tile_layer_name}.geojson`

    write(geojson_path, layer_features)

    const temp_tiles_city_path = `${temp_tiles_path}/${city}`
    mkdir_if_needed(temp_tiles_city_path)

    const temp_mbtiles_path = `${temp_tiles_city_path}/${tile_layer_name}.mbtiles`
    all_mbtiles_paths.push(temp_mbtiles_path)

    const minz = minzoom
        || city_assets.minzoom
        || DEFAULT_CITY_MINZOOM

    exec(`
        tippecanoe -o ${temp_mbtiles_path} \
        --minimum-zoom=${Math.floor(minz)} --maximum-zoom=17 \
        --no-tile-compression -f \
        --drop-rate=1 \
        ${geojson_path}`);
}


const features_from_renderables = city_assets.renderables?.flatMap(r => {
    if (r.id.match(/\s/)) {
        console.warn('ERROR: renderable id has white space:', r.id)
        process.exit(1)
    }

    const features = r.get_features(all_geojson.features).map(f => {
        // add .properties if absent, to avoid errors
        return { ...f, properties: f.properties || {} }
    })

    generate_temp_mbtiles(
        r.id,
        r.style_layer.minzoom,
        features
    )

    return features
}) || []

write(
    city_root_path + '/temp_data/all_geojson_features_with_renderables.geojson',
    [...all_geojson.features, ...features_from_renderables]
)







// For each city's tile_layer:
// 1) tile_layer.feature_filter will be executed for ALL data
// 2) only features specified in tile_layer.feature_props_to_preserve will be preserved
// 3) features specified in tile_layer.added_props will be added
// 4) result will be written
// 5) temporary .mbtiles will be created for current layer's geojson
// (it's to enable individual minzooms for layers; then all .mbtiles are joined)
city_assets.tile_layers
    .concat(general_tile_layers)
    .forEach(tile_layer => {
        if (!tile_layer.feature_filter) throw new Error('feature_filter not defined for tile_layer ' + tile_layer.name)
        if (!tile_layer.name) throw new Error('name not defined for tile_layer ' + tile_layer)

        const layer_features = all_geojson.features
            .filter(tile_layer.feature_filter)
            .map(f => {
                tile_layer.added_props?.forEach(prop => {
                    if (f.properties[prop] !== undefined) {
                        throw new Error(`trying to add extra prop ${prop} to ${f.id} but feature already has it`)
                    }
                    if (prop === 'is_selectable') {
                        f.properties[prop] = is_feature_selectable(f.id, hmdata)
                    } else if (prop === 'has_title') {
                        f.properties[prop] = does_feature_have_title(f.id, hmdata)
                    } else if (prop.name && prop.get_value) {
                        f.properties[prop.name] = prop.get_value(f)
                    }
                })
                return f
            })
            .map(f => clear_feature_props(f, tile_layer))
            // sort is just to get a more readable git diff, in case I want to track osm data changes, e.g. what french bldgs were removed
            .sort((a, b) => b.id - a.id)

        generate_temp_mbtiles(tile_layer.name, tile_layer.minzoom, layer_features)
    })


const final_tiles_path = `../cities_tiles/${city}/tiles`
mkdir_if_needed(final_tiles_path)
exec(`rm -rf ${final_tiles_path}/*`)

exec(`
    tile-join -e ${final_tiles_path} \
    --no-tile-compression -f \
    ${all_mbtiles_paths.join(' ')}`);

exec(`rm -rf ${temp_tiles_path}/*`);
