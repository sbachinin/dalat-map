/* 
  This checks that:
  - I didn't forget to add some images (files) to the buildings
  - I don't use any nonexistent filenames in buildings data and highlights
  - there are no duplicate images in fids_to_img_names and highlights_order
  - All images from highlights are assigned to buildings
  - Images are of reasonable size
*/

import fs from 'fs'
import path from 'path'

export const validate_images = async (cityname) => {

    const large_img_dir = path.resolve(`../cities_images/${cityname}/dist/large`)
    const city_root_dir = `../${cityname}`
    const fids_to_img_names = (await import(city_root_dir + '/static_data/fids_to_img_names.mjs')).fids_to_img_names

    let rejected_imgs = []
    try {
        rejected_imgs = (await import(city_root_dir + '/static_data/rejected_imgs.mjs')).rejected_imgs
    } catch (e) { }

    const files_imgs_names = fs.readdirSync(large_img_dir)
    const all_buildings_imgs_names = Object.values(fids_to_img_names)
        .flatMap(arr => arr)


    // 1.
    // Check if I failed to add all available images to handmade data
    // copy them to "missing" folder to drop them later to their buildings
    const missing_imgs_dir = path.resolve(`../cities_images/${cityname}/missing`)
    const json_set = new Set(all_buildings_imgs_names)
    const orphan_imgs_filenames = files_imgs_names.filter(img => {
        return !rejected_imgs.includes(img) // some imgs are omitted intentionally => don't yell
            && !json_set.has(img)
    })
    if (orphan_imgs_filenames.length === 0) {
        console.log('✅ All generated images (excluding those explicitly rejected) are assigned to buildings')
        // rm missing dir
        const missing_imgs_dir = path.resolve(`../cities_images/${cityname}/missing`)
        if (fs.existsSync(missing_imgs_dir)) {
            fs.rmSync(missing_imgs_dir, { recursive: true, force: true })
        }
    } else {
        // make sure "missing" folder exists and is empty
        if (fs.existsSync(missing_imgs_dir)) {
            fs.readdirSync(missing_imgs_dir).forEach(file => {
                fs.unlinkSync(path.join(missing_imgs_dir, file))
            })
        } else {
            fs.mkdirSync(missing_imgs_dir)
        }

        orphan_imgs_filenames.forEach(img => {
            console.log('❌ ' + img + ' is missing in handmade data and was copied to "missing" folder')
            const oldPath = path.join(large_img_dir, img)
            const missing_path = path.join(missing_imgs_dir, img)
            fs.copyFileSync(oldPath, missing_path)
        })
    }


    // 2.
    // Check that no buildings contain duplicate images
    Object.values(fids_to_img_names)
        .forEach(imgs_of_a_bldg => {
            const imgs_set = new Set(imgs_of_a_bldg)
            if (imgs_set.size !== imgs_of_a_bldg.length) {
                console.log('❌ Duplicate image in', imgs_of_a_bldg)
                process.exit(1)
            }
        })
    console.log('✅ No duplicate images found in fids_to_img_names')

    // 3.
    // complain if handmade data contains nonexistent filenames
    const imgs_filenames_set = new Set(files_imgs_names)
    const bldgs_imgs_missing_in_files = all_buildings_imgs_names.filter(img => !imgs_filenames_set.has(img))
    if (bldgs_imgs_missing_in_files.length === 0) {
        console.log('✅ No broken images found in fids_to_img_names')
    } else {
        bldgs_imgs_missing_in_files.forEach(img => {
            console.log('❌ ' + img + ' in fids_to_img_names is missing in files')
        })
        process.exit(1)
    }


    // 4.
    // Check that highlights don't contain duplicates
    const { highlights_order } = await import(`../${cityname}/static_data/highlights_order.mjs`)
    const highlights_set = new Set(highlights_order)
    if (highlights_set.size !== highlights_order.length) {
        console.warn(`❌ Duplicate image found in highlights_order`)
        process.exit(1)
    }
    console.log('✅ No duplicate images found in highlights')


    // 5.
    // Check that highlights list doesn't contain nonexistent images names    
    const hl_imgs_missing_in_files = highlights_order.filter(img => !imgs_filenames_set.has(img))
    if (hl_imgs_missing_in_files.length === 0) {
        console.log('✅ No broken images found in highlights_order')
    } else {
        hl_imgs_missing_in_files.forEach(img => {
            console.log('❌ ' + img + ' from highlights is missing in files')
        })
        process.exit(1)
    }

    // 6.
    // Check that all highlights are assigned to buildings
    // * I compare names without extension:
    // * Because highligts order is taken from google photos where .heic files are still .heic,
    // * and fids_to_img_names contains "final" images names with heic already converted to jpg
    const all_buildings_imgs_basenames = all_buildings_imgs_names
        .map(img_name => img_name.split('.')[0])

    const missing_highlights = highlights_order.filter(
        hl_name => !all_buildings_imgs_basenames.includes(hl_name.split('.')[0])
    )
    if (missing_highlights.length > 0) {
        console.log('❌ ' + missing_highlights.length + ` highlights don't belong to any buildings in fids_to_imgs_names:`)
        missing_highlights.forEach(hl => console.log(hl))
        process.exit(1)
    } else {
        console.log('✅ All highlights images are assigned to buildings')
    }

}