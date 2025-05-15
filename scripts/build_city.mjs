import { execSync } from 'child_process';
import { parse_args } from "./utils.mjs"

const { skip_osm_download, city } = parse_args()

execSync(
    `node ./generate_tiles.mjs city=${city} ${skip_osm_download ? 'skip_osm_download' : ''}`,
    { stdio: 'inherit' }
)

execSync(
    `node ./save_polygons_centroids_etc.mjs city=${city}`,
    { stdio: 'inherit' }
)