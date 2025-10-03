import fs from 'fs'
import { fileURLToPath } from 'url'
import { readdir } from 'fs/promises'
import { join } from 'path'
import { pathToFileURL } from 'url'

export const generate_id = () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)

export const parse_args = () => {
    const params = {};

    process.argv.slice(2)
        .forEach(arg => {
            if (arg.includes('=')) {
                const [key, value] = arg.split('=');
                params[key] = value;
            } else {
                params[arg] = true;
            }
        });

    return params;
}

export const mkdir = (path) => {
    try {
        fs.mkdirSync(path, { recursive: true })
    } catch (e) {
        console.log(e)
        process.exit(1)
    }
}

export const mkdir_if_needed = (path) => {
    if (!fs.existsSync(path)) {
        mkdir(path)
    }
}


export const maybe_import_default = async path => {
    try {
        const module = await import(path)
        return module.default
    } catch (e) {
        return null
    }
}


export const is_real_number = (value) => {
    return typeof value === 'number' && !isNaN(value)
}


export function calculate_minzoom(bounds, screen_width, screen_height) {

    // Calculate the width and height of the bounds in degrees
    const bounds_width = bounds[2] - bounds[0]
    const bounds_height = bounds[3] - bounds[1]

    const bounds_asp_ratio = bounds_width / bounds_height
    const screen_asp_ratio = screen_width / screen_height

    // Determine which dimension is limiting
    let zoom_factor
    if (bounds_asp_ratio > screen_asp_ratio) {
        // Width is the limiting factor
        zoom_factor = 360 / bounds_width
    } else {
        // Height is the limiting factor
        zoom_factor = 180 / bounds_height
    }

    const zoom = Math.log2(zoom_factor * screen_width / 256) // 256 px is standard tile size

    return Math.floor(zoom)
}


export const push_with_overwrite = (arr1, arr2) => {
    // if there are features with the same id in both arr1 and arr2, take only the one from arr2
    return arr1
        .filter(f1 => !arr2.some(f2 => f2.id === f1.id))
        .concat(arr2)
}

// take only last one with same id
export const remove_duplicates_by_id = features => {
    const ids = new Set()
    const unique_features = []
    for (const f of features.reverse()) {
        if (ids.has(f.id)) {
            continue
        }
        unique_features.push(f)
        ids.add(f.id)
    }
    return unique_features.reverse()
}


const __filename = fileURLToPath(import.meta.url)
const __dirname = join(__filename, '..')

export async function import_from_all_mjs_files(folder) {
    const dirPath = join(__dirname, folder)
    const files = await readdir(dirPath)

    const imports = []
    for (const file of files) {
        if (file.endsWith('.mjs')) {
            const modulePath = pathToFileURL(join(dirPath, file)).href
            const mod = await import(modulePath)
            imports.push({ file, module: mod })
        }
    }
    return imports
}