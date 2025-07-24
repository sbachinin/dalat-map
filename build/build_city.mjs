import { execSync } from 'child_process';
import { parse_args } from "./build_utils.mjs"

const args = parse_args()

// config_to_adjust_manually
const skip_osm_download = true
const city = args.city || 'hue'
const should_process_images = args.should_process_images || false
const reprocess_old_images = args.reprocess_old_images || false


// TODO if any of these fails, will it stop execution?

execSync(
    `node ./generate_tiles.mjs city=${city} ${skip_osm_download ? 'skip_osm_download' : ''}`,
    { stdio: 'inherit' }
)

execSync(
    `node ./generate_features_props_for_frontend.mjs city=${city}`,
    { stdio: 'inherit' }
)

should_process_images && execSync(
    `cd ./images && node ./process_images.mjs city=${city} ${reprocess_old_images ? 'force' : ''}`,
    { stdio: 'inherit' }
)