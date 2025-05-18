import fs from 'fs'
import { get_centroid } from './get_centroid.mjs';

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



const get_all_lats = feature => {
    if (!feature?.geometry?.coordinates) {
        throw new Error("Invalid GeoJSON feature")
    }

    const { type, coordinates } = feature.geometry

    let all_lats = []

    if (type === "Polygon") {
        all_lats = coordinates[0].map(coord => coord[1])
    } else if (type === "MultiPolygon") {
        all_lats = coordinates.flat(2).map(coord => coord[1])
    } else {
        throw new Error("Geometry type must be Polygon or MultiPolygon")
    }

    return all_lats
}




// All titles are positioned at the center of the building,
// except those with "title_side" handmade prop
// and french (positioned at south if title_side not specified).
// Returns 'south', 'north' or 'center'
// 'Left' and 'right' could also make sense but there was no need so far
export const get_title_side = (f, hmdata) => {
    const f_hmdata = hmdata[f.id]

    let title_side = 'center'

    if (f_hmdata?.title_side) {
        if (
            !['south', 'north', 'center'].includes(f_hmdata.title_side)) {
            console.warn('This title side is not supported: ', f_hmdata.title_side)
            return null
        }
        title_side = f_hmdata.title_side

    } else if (f.properties['building:architecture'] === 'french_colonial') {
        title_side = 'south'
    }

    return title_side
}



export const get_title_lat = (
    f, // geojson feature
    hmd
) => {
    const title_side = get_title_side(f, hmd)
    if (title_side === null) {
        console.warn('Invalid title_side for feature', f.id)
        process.exit(1)
    }

    if (title_side === 'south') {
        return Math.min(...get_all_lats(f))
    } else if (title_side === 'north') {
        return Math.max(...get_all_lats(f))
    } else if (title_side === 'center') {
        return get_centroid(f)[1]
    }
}
