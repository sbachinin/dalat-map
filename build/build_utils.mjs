import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

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

export const is_running_from_cmd_line = () => {
    return path.basename(fileURLToPath(import.meta.url)) === path.basename(process.argv[1])
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
    return arr1
        .filter(f1 => !arr2.some(f2 => f2.id === f1.id))
        .concat(arr2)
}