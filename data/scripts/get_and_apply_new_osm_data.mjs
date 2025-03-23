import { execSync } from 'child_process'
import fs from 'fs'
import { bldgs_handmade_data } from '../static/bldgs_handmade_data.mjs';
import { land_areas_handmade_data } from '../static/handmade_data.mjs';
import { does_building_have_details, does_building_have_title } from '../../js/utils/does_building_have_details.mjs';
import { compare_arrays_of_features } from './compare_arrays_of_features.mjs';
import { BORING_BLDGS_MINZOOM, map_bounds, MINOR_ROADS_MINZOOM } from '../../js/layers/constants.mjs';

const args = process.argv.slice(2); // Get command-line arguments, excluding "node" and script name

let no_download = false;

for (const arg of args) {
    if (arg === 'no-download') {
        no_download = true;
        break;
    }
}

const write = (path, data) => {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}




let initial_french_bldgs = [];
if (fs.existsSync('../temp/french_building.geojson')) {
    initial_french_bldgs = JSON.parse(fs.readFileSync('../temp/french_building.geojson', 'utf-8'));
}



execSync('rm -f ../temp/*.geojson', { stdio: 'inherit' });

if (!no_download) {
    execSync('rm -f ../temp/*.osm', { stdio: 'inherit' });

    const bbox = map_bounds.join(',')
    const url = `https://overpass-api.de/api/map?bbox=${bbox}`;
    execSync(`curl -o ../temp/output.osm "${url}"`, { stdio: 'inherit' });
}

execSync('osmtogeojson ../temp/output.osm > ../temp/from_osm.geojson', { shell: true, stdio: 'inherit' });











const inputPath = '../static/dalat_bulk_geometry.geojson';
const outputPath = '../temp/dalat_bulk_geometry_as_linestring.geojson';

const data = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

const transformed = {
    type: 'Feature',
    properties: data[0].properties,
    geometry: {
        type: 'LineString',
        coordinates: data[0].geometry.coordinates[0],
    },
};

write(outputPath, transformed);









// merge my custom geojson into osm's geojson,
// prioritize custom features in case of duplicate ids

const geojsonData = [
    JSON.parse(fs.readFileSync('../temp/from_osm.geojson', 'utf-8')),
    JSON.parse(fs.readFileSync('../static/all_custom_features.geojson', 'utf-8')),
]

let features = geojsonData.flatMap(data => data.features || []);

const seenIds = new Set();
features = features.reverse().filter(feature => {
    if (!feature.id || seenIds.has(feature.id)) return false;
    seenIds.add(feature.id);
    return true;
}).reverse();

const all_geojson = { type: 'FeatureCollection', features };







// DROP NON-NUMERIC PART OF FEATURE ID SUCH AS "way/"
all_geojson.features = all_geojson.features
    .map(feature => {
        if (typeof feature.id === 'string') {
            feature.id = feature.id.replace(/^(way|node|relation)\//, '');
            feature.id = Number(feature.id);
        }
        return feature;
    })









const clear_feature_props = (feature, props_to_preserve = []) => {
    const properties = {}
    props_to_preserve.forEach(prop_name => {
        properties[prop_name] = feature.properties[prop_name];
    })
    return {
        type: feature.type,
        geometry: feature.geometry,
        id: feature.id,
        properties
    }
}

// SPLIT GEOJSON INTO LAYERS

write(
    '../temp/boring_building.geojson',
    all_geojson.features
        .filter(feature => {
            const props = feature.properties || {};
            return (
                props.building != null &&
                props['building:architecture'] !== 'french_colonial' &&
                feature.id !== 1275206355
            );
        })
        .map(f => clear_feature_props(f))
        .map(f => {
            f.properties.has_title = does_building_have_title(f.id)
            return f;
        })
);


const new_french_bldgs = all_geojson.features
    .filter(f => {
        return f.properties['building:architecture'] === 'french_colonial';
    })
    .map(f => clear_feature_props(f))
    .map(f => {
        f.properties.has_details = does_building_have_details(f.id);
        f.properties.has_title = does_building_have_title(f.id);
        f.properties.is_important = !(bldgs_handmade_data[f.id]?.second_rate);
        return f;
    })
    .sort((a, b) => b.id - a.id) // to get a more readable git diff

write(
    '../temp/french_building.geojson',
    new_french_bldgs
);

// if feature.properties.highway is one of the following, it's a major road, otherwise minor
const major_road_highway_values = ['tertiary', "primary",
    "primary_link",
    "secondary",
    "trunk"]

write(
    '../temp/major_roads.geojson',
    all_geojson.features
        .filter(f => {
            return major_road_highway_values.includes(f.properties.highway);
        })
        .map(f => clear_feature_props(f, ['highway']))
);

const pedestrian_highway_values = ['footway', 'cycleway', 'steps', 'path']
write(
    '../temp/minor_roads.geojson',
    all_geojson.features
        .filter(f => {
            return f.properties.highway
                && !major_road_highway_values.includes(f.properties.highway);
        })
        .map(f => {
            if (pedestrian_highway_values.includes(f.properties.highway)) {
                f.properties.is_pedestrian_path = true;
            }
            return clear_feature_props(f, ['is_pedestrian_path']);
        })
);

write(
    '../temp/railway.geojson',
    all_geojson.features
        .filter(f => {
            return f.properties.railway == 'rail' || f.properties.railway == 'station';
        })
        .map(f => clear_feature_props(f, ['railway']))
);

write(
    '../temp/peaks.geojson',
    all_geojson.features.filter(f => {
        return f.properties.natural == 'peak';
    })
);

write(
    '../temp/transportation_other.geojson',
    all_geojson.features.filter(f => {
        return f.properties.aerialway == 'cable_car' || f.properties.aerialway == 'station';
    })
);

write(
    '../temp/lake.geojson',
    all_geojson.features
        .filter(f => {
            return f.properties.natural == 'water'
                && (
                    f.properties.name == 'Hồ Xuân Hương'
                    || f.properties.name == 'Hồ Tuyền Lâm'
                    || f.properties.name == 'Hồ Chiến Thắng'
                    || f.properties.name == 'Hồ Đa Thiện'
                )
        })
        .map(f => clear_feature_props(f))
);

write(
    '../temp/river.geojson',
    all_geojson.features
        .filter(f => f.properties.waterway == 'stream')
        .map(f => clear_feature_props(f))
);

write(
    '../temp/land_areas.geojson',
    all_geojson.features
        .filter(f => land_areas_handmade_data.hasOwnProperty(f.id.toString()))
        .map(f => clear_feature_props(f))
        .map(f => {
            f.properties.area_type = land_areas_handmade_data[f.id.toString()].area_type || null;
            return f;
        })
);

import('./save_polygons_centroids.mjs')
import('./save_some_features_ids.mjs')




const temp_tiles_path = `../../dalat-map-tiles/temp`
const main_mbtiles_path = `${temp_tiles_path}/main.mbtiles`
const minor_roads_mbtiles_path = `${temp_tiles_path}/minzoom_14.mbtiles`
const boring_building_mbtiles_path = `${temp_tiles_path}/boring_buildings.mbtiles`

const make_main_mbtiles = `
    tippecanoe -o ${main_mbtiles_path} \
    --minimum-zoom=10 --maximum-zoom=17 \
    --no-tile-compression -f \
    ../temp/french_building.geojson \
    ../temp/lake.geojson \
    ../temp/river.geojson \
    ../temp/land_areas.geojson \
    ../temp/major_roads.geojson \
    ../temp/railway.geojson \
    ../temp/peaks.geojson \
    ../temp/transportation_other.geojson \
    ../temp/dalat_bulk_geometry_as_linestring.geojson \
    ../static/dead_buildings.geojson \
    ../static/dalat_bulk_geometry.geojson
`
const make_minor_roads_mbtiles = `
    tippecanoe -o ${minor_roads_mbtiles_path} \
    --minimum-zoom=${MINOR_ROADS_MINZOOM} --maximum-zoom=17 \
    --no-tile-compression -f \
    ../temp/minor_roads.geojson \
`

const make_boring_bldgs_mbtiles = `
    tippecanoe -o ${boring_building_mbtiles_path} \
    --minimum-zoom=${BORING_BLDGS_MINZOOM} --maximum-zoom=17 \
    --no-tile-compression -f \
    ../temp/boring_building.geojson \
`

execSync(make_main_mbtiles, { stdio: 'inherit' });
execSync(make_minor_roads_mbtiles, { stdio: 'inherit' });
execSync(make_boring_bldgs_mbtiles, { stdio: 'inherit' });

execSync(`
    tile-join -e ../../dalat-map-tiles/tiles \
    --no-tile-compression -f \
    ${main_mbtiles_path} \
    ${minor_roads_mbtiles_path} \
    ${boring_building_mbtiles_path}
`, { stdio: 'inherit' });

execSync(`rm -f ${temp_tiles_path}/*`, { stdio: 'inherit' });

compare_arrays_of_features(initial_french_bldgs, new_french_bldgs);
