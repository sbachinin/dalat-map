import fs from 'fs'
import path from 'path';
import { parse_args } from "./utils.mjs"

const { city: cityname } = parse_args()

if (!cityname) {
    console.log('city name is required')
    process.exit(1)
}

const compare_highlights_with_directory = (dir_path, highlights_list) => {

    const file_in_directory = fs.readdirSync(dir_path)
        .map(file => path.basename(file))

    const data_set = new Set(highlights_list)
    const directory_set = new Set(file_in_directory)

    // The following check was perhaps not very helpful
    // + It's very fragile:
    // once jpgs are made from heic files, directory grows by the number of heic files
    // So I need some extra filter to make it work properly, and it seems too much
    // if (data_set.size !== directory_set.size) {
    //     console.log(`number of items in names array (${data_set.size})
    //     doesn't match the number of files in images folder (${directory_set.size})`)
    //     process.exit(1)
    // }

    const dir_has_all_names = [...data_set].every(file => {
        if (directory_set.has(file)) return true
        console.log('no such file in images dir: ', file)
    })

    if (dir_has_all_names) {
        console.log("All images from highlights order are present in directory.")
    } else {
        console.log("WARNING: Highlights directory is missing some files from highlights order")
        process.exit(1)
    }
}


// WHY?
// because by highlight image name I (supposedly) will look up the bldg
const compare_highlights_with_bldgs_data = async (highlights_order) => {

    const { fids_to_img_names } = await import(`../${cityname}/static_data/fids_to_img_names.mjs`)

    // I compare names without extension
    // Because highligts order is taken from google photos where .heic files are still .heic,
    // and fids_to_img_names contains "final" images names with heic already converted to jpg
    const all_buildings_images_names = Object.values(fids_to_img_names)
        .flatMap(f => f)
        .map(img_name => img_name.split('.')[0])

    const missing_highlights = highlights_order.filter(
        hl_name => !all_buildings_images_names.includes(hl_name.split('.')[0])
    )
    if (missing_highlights.length > 0) {
        console.log(missing_highlights.length + ` highlights don't belong to any buildings in fids_to_imgs_names:`)
        missing_highlights.forEach(hl => console.log(hl))
        process.exit(1)
    } else {
        console.log('All highlights are present in buildings handmade data.')
    }
}



const { highlights_order } = await import(`../${cityname}/static_data/highlights_order.mjs`)

compare_highlights_with_directory(
    `../cities_images/${cityname}/src/highlights`,
    highlights_order
)

await compare_highlights_with_bldgs_data(highlights_order)

console.log('Images is ok')
