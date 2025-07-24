import { execSync } from 'child_process';
import { parse_args } from "./build_utils.mjs"

const args = parse_args()

// config_to_adjust_manually
const city = args.city || 'hue'

const should_generate_tiles = args.should_generate_tiles || 1
const skip_osm_download = 1
const should_process_images = args.should_process_images || 0
const reprocess_old_images = args.reprocess_old_images || 0


// TODO if any of these fails, will it stop execution?

if (should_generate_tiles) {
    execSync(
        `node ./generate_tiles.mjs city=${city} ${skip_osm_download ? 'skip_osm_download' : ''}`,
        { stdio: 'inherit' }
    )
    execSync(
        `node ./generate_features_props_for_frontend.mjs city=${city}`,
        { stdio: 'inherit' }
    )
}

should_process_images && execSync(
    `cd ./images && node ./process_images.mjs city=${city} ${reprocess_old_images ? 'force' : ''}`,
    { stdio: 'inherit' }
)