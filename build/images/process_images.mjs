// Args: "force" and "city=<city_name>"

import { parse_args } from '../build_utils.mjs'
import { process_image } from './process_1_image.mjs'
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


const resize_from_folder = async (source_folder, force = false) => {
    const filenames = await fs_promises.readdir(source_folder)

    for (const filename of filenames) {
        const file_path = path.join(source_folder, filename)

        if (filename.endsWith(':Zone.Identifier')) {
            fs.unlinkSync(file_path)
            continue
        }

        if (filename.startsWith('ignored_')) {
            continue
        }

        const stat = await fs_promises.stat(file_path)

        if (stat.isFile()) {
            await process_image(source_folder, filename, force)
        }
    }
}

const src_folders = fs.readdirSync(city_images_folder + '/src/')
    .map(f => city_images_folder + '/src/' + f)
    .filter(f => fs.statSync(f).isDirectory())




// Fail if there are duplicate image basenames
// (otherwise, having images with same basename but different extension, only 1 file will end up in dist/, and some will be lost)

const all_imgs_names = new Set()
for (const some_src_folder of src_folders) {
    const filenames = fs.readdirSync(some_src_folder)
    for (const filename of filenames) {
        const name = filename.split('.')[0]
        if (all_imgs_names.has(name)) {
            console.log('Duplicate image basename:', path.join(some_src_folder, filename))
            process.exit(1)
        }
        all_imgs_names.add(name)
    }
}




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

for (const some_src_folder of src_folders) {
    await resize_from_folder(some_src_folder, force)
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
    const osmid = path.parse(osmid_filename).name.split('_')[1]

    if (!osmid.match(/^[0-9]+$/)) {
        console.log('Non-numeric osmid in', osmid_filename)
        process.exit(1)
    }

    if (!fids_to_img_names[osmid]) {
        fids_to_img_names[osmid] = []
    }

    if (!fids_to_img_names[osmid].includes(osmid_filename)) {
        fids_to_img_names[osmid].push(osmid_filename)
    }
}



// 2. go through fids_to_img_names and remove the images that aren't found in large/

const large_filenames = fs.readdirSync(large_folder)
    .map(f => path.parse(f).base)

for (const osmid in fids_to_img_names) {
    fids_to_img_names[osmid] = fids_to_img_names[osmid].filter(f => large_filenames.includes(f))
}







const fids_as_str = JSON.stringify(fids_to_img_names, null, 2)
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