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

    const large_img_files_names = fs.readdirSync(large_img_dir)
    const all_buildings_imgs_basenames = Object.values(fids_to_img_names)
        .flatMap(arr => arr)


    // 0.
    // Check that all files_imgs_names are jpg
    const non_jpg_imgs = large_img_files_names.filter(img => !img.endsWith('.jpg'))
    if (non_jpg_imgs.length > 0) {
        console.log('❌ Some images are not jpg:', non_jpg_imgs)
        process.exit(1)
    }

    // 0.1
    // Check that thumbs/ and large/ contain files with same names 
    const files_in_thumbs = fs.readdirSync(path.resolve(`../cities_images/${cityname}/dist/thumbs`))
    const files_in_large = fs.readdirSync(path.resolve(`../cities_images/${cityname}/dist/large`))
    if (
        files_in_thumbs.find(f => !files_in_large.includes(f))
        || files_in_large.find(f => !files_in_thumbs.includes(f))
    ) {
        console.log('❌ thumbs/ and large/ contain files with different names')
        process.exit(1)
    }


    // 1.
    // Check if I failed to add all available images to handmade data
    // copy them to "unassigned" folder to drop them later to their buildings
    const assigned_images_basenames_set = new Set(all_buildings_imgs_basenames)
    const orphan_imgs_basenames = large_img_files_names
        .map(n => n.split('.')[0])
        .filter(n => !assigned_images_basenames_set.has(n))
    if (orphan_imgs_basenames.length === 0) {
        console.log('✅ All generated images (excluding those explicitly rejected) are assigned to buildings')
    } else {
        fs.writeFileSync(
            path.resolve(`../${cityname}/static_data/unassigned_images.mjs`),
            'export const unassigned_images = ' + JSON.stringify(orphan_imgs_basenames, null, 2)
        )
        console.log('⚠️ ', orphan_imgs_basenames.length, 'images are not assigned to buildings')
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
    // complain if fids_to_img_names contains nonexistent filenames
    const imgs_files_basenames_set = new Set(large_img_files_names.map(img => img.split('.')[0]))
    const bldgs_imgs_missing_in_files = all_buildings_imgs_basenames
        .filter(img => !imgs_files_basenames_set.has(img))
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
    const hl_imgs_missing_in_files = highlights_order.filter(img => !imgs_files_basenames_set.has(img))
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

    // 7.
    // Check that all images are of reasonable size
    const SIZE_LIMIT = 1000 * 1024 // in kb
    const too_heavy_imgs = large_img_files_names.filter(file => {
        const file_path = path.join(large_img_dir, file)
        const stats = fs.statSync(file_path)
        if (stats.isFile() && stats.size > SIZE_LIMIT) {
            console.log(`\x1b[33m⚠️  Warning:\x1b[0m ${file} is ${(stats.size / 1024).toFixed(1)} KB`)
            return true
        }
    })

    if (too_heavy_imgs.length === 0) {
        console.log('✅ No large/ images are too heavy')
    }
}