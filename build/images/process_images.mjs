// Args: "force" and "city=<city_name>"

import { parse_args } from '../utils.mjs'
import { process_image } from './process_1_image.mjs'
import fs from 'fs'
import * as fs_promises from 'fs/promises'

import path from 'path'

const { city: cityname, force } = parse_args()

if (!cityname) {
    console.log('city name is required')
    process.exit(1)
}

const city_images_folder = '../../cities_images/' + cityname

if (!fs.existsSync(city_images_folder)) {
    console.log('No folder for such city:', city_images_folder)
    process.exit(1)
}

const thumbs_folder = city_images_folder + '/dist/thumbs'
const large_folder = city_images_folder + '/dist/large'

// Ensure output folders exist
fs.mkdirSync(thumbs_folder, { recursive: true })
fs.mkdirSync(large_folder, { recursive: true })


if (force) {
    // Clear output folders
    [thumbs_folder, large_folder].forEach(folder => {
        fs.readdirSync(folder).forEach(filename => {
            const file_path = path.join(folder, filename)
            if (fs.statSync(file_path).isFile()) {
                fs.unlinkSync(file_path)
            }
        })
    })
}


const resize_from_folder = async (source_folder, force = false) => {
    const filenames = await fs_promises.readdir(source_folder)

    for (const filename of filenames) {
        const file_path = path.join(source_folder, filename)
        const stat = await fs_promises.stat(file_path)

        if (stat.isFile()) {
            await process_image(source_folder, filename, force)
        }
    }
}

const src_folders = fs.readdirSync(city_images_folder + '/src/')
    .map(f => city_images_folder + '/src/' + f)
    .filter(f => fs.statSync(f).isDirectory())

for (const some_src_folder of src_folders) {
    await resize_from_folder(some_src_folder, force)
}

console.log('Images have been resized')
