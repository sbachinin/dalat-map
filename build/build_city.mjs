import { execSync } from 'child_process';
import { parse_args } from "./build_utils.mjs"
import { validate_images } from './validate_images.mjs'
import { update_osm_data } from './update_osm_data.mjs';
import { save_buildings_props_for_frontend } from './save_buildings_props_for_frontend.mjs';

// config_to_adjust_manually
const defaults = {
    city: 'malacca',
    generate_tiles: 0,
    skip_osm_download: 1,
    process_images: 0,
    shall_validate_images: 1,
    purge_old_images: 0
}

const args = parse_args()
const city = args.city || defaults.city
const generate_tiles = args.generate_tiles || defaults.generate_tiles
const skip_osm_download = defaults.skip_osm_download
const process_images = args.process_images || defaults.process_images
const shall_validate_images = args.shall_validate_images || defaults.shall_validate_images
const purge_old_images = args.purge_old_images || defaults.purge_old_images

console.log('Building city:', city.toUpperCase())

/*
    Images should be processed first
    because it can affect bldgs data (images names can be added dynamically to fids_to_...)
*/

if (process_images) {
    execSync(
        `cd ./images && node ./process_images.mjs city=${city} ${purge_old_images ? 'force' : ''}`,
        { stdio: 'inherit' }
    )
}

if (shall_validate_images) {
    await validate_images(city)
}

if (!skip_osm_download) {
    await update_osm_data(city)
}

save_buildings_props_for_frontend(city)

if (generate_tiles) {
    execSync(
        `node ./generate_tiles.mjs city=${city} ${skip_osm_download ? 'skip_osm_download' : ''}`,
        { stdio: 'inherit' }
    )
    execSync(
        `node ./generate_features_props_for_frontend.mjs city=${city}`,
        { stdio: 'inherit' }
    )
}
