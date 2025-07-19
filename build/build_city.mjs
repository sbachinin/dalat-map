import { execSync } from 'child_process';
import { parse_args } from "./build_utils.mjs"

const { reprocess_old_photos, city } = parse_args()

// TODO if any of these fails, will it stop execution?

execSync(
    `node ./generate_tiles.mjs city=${city}`,
    { stdio: 'inherit' }
)

execSync(
    `node ./generate_features_props_for_frontend.mjs city=${city}`,
    { stdio: 'inherit' }
)

execSync(
    `cd ./images && node ./process_images.mjs city=${city} ${reprocess_old_photos ? 'force' : ''}`,
    { stdio: 'inherit' }
)