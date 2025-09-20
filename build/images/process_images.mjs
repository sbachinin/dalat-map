// Args: "force" and "city=<city_name>"

import { parse_args } from '../build_utils.mjs'
import { process_1_image } from './process_1_image.mjs'
import fs from 'fs'
import * as fs_promises from 'fs/promises'
import path from 'path'
import sharp from 'sharp'

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


const entries = await fs_promises.readdir(
    city_images_folder + '/src/',
    { recursive: true, withFileTypes: true },
    (err) => { err && console.error('Error:', err) }
)
const all_src_files_paths = entries
    .filter(dirent => dirent.isFile())
    .map(dirent => path.join(dirent.path, dirent.name))

const previous_basenames = []



for (const file_path of all_src_files_paths) {
    if (file_path.endsWith(':Zone.Identifier')) {
        fs.unlinkSync(file_path)
        continue
    }

    const basename = path.parse(file_path).name

    if (basename.startsWith('ignored_')) {
        continue
    }

    if (previous_basenames.includes(basename)) {
        // (Otherwise, having images with same basename but different extension,
        // or different images with same name in different folders,
        // only 1 file will end up in dist/, and some will be lost)
        console.error('Duplicate image basename:', file_path)
        process.exit(1)
    } else {
        previous_basenames.push(basename)
    }

    await process_1_image(file_path, force)
}

console.log('Images have been resized')








// 1. add new osmid_ images to fids_to_img_names

/*
In "large" folder, find all files that begin with "osmid_",
from the filename take the part after the first _ and before the second _, if there is a second one.
check that this part is numeric only, exit if no.
Take the file [city_folder]/static_data/fids_to_img_names.mjs, from it import const fids_to_img_names
In this object, find the id that corresponds to the numeric part of the osmid_... filename.
If there is no such entry, initialize it with an empty array.
Append to the entry's filename_string array the osmid_... filename, if it wasn't there before.
*/
const { fids_to_img_names } = await import(`../../${cityname}/static_data/fids_to_img_names.mjs`)

const osmid_filenames = fs.readdirSync(large_folder)
    .filter(f => f.startsWith('osmid_'))

for (const osmid_filename of osmid_filenames) {
    const osmid_file_basename = path.parse(osmid_filename).name
    const osmid = osmid_file_basename.split('_')[1]

    if (!osmid.match(/^[0-9]+$/)) {
        console.log('Non-numeric osmid in', osmid_filename)
        process.exit(1)
    }

    if (!fids_to_img_names[osmid]) {
        fids_to_img_names[osmid] = []
    }

    if (!fids_to_img_names[osmid].includes(osmid_file_basename)) {
        fids_to_img_names[osmid].push(osmid_file_basename)
    }
}







const fids_as_str = JSON.stringify(fids_to_img_names, null, 4)
fs.writeFileSync(
    `../../${cityname}/static_data/fids_to_img_names.mjs`,
    `export const fids_to_img_names = ${fids_as_str}`
)
console.log('"osmid_..." files names were written to fids_to_img_names')




const files = fs.readdirSync(large_folder)
const sizes = {}
for (const file of files) {
    const file_path = path.join(large_folder, file)
    const metadata = await sharp(file_path).metadata()
    sizes[file] = [metadata.width, metadata.height]
}
const sizes_as_str = JSON.stringify(sizes, null, 2)
fs.writeFileSync(
    `../../${cityname}/static_data/images_sizes.mjs`,
    `export const images_sizes = ${sizes_as_str}`
)
console.log(`Images sizes were written to images_sizes.mjs`)