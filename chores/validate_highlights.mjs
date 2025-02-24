import fs from 'fs'
import path from 'path';

// To be run after images have been processed
// (=> heic is already converted to jpg)
function compare_highlights_with_directory(dir_path, highlights_list) {

    const file_in_directory = fs.readdirSync(dir_path)
        .map(file => path.basename(file))
        .filter(filename => !filename.match('Zone.Identifier'))
        .filter(filename => !filename.endsWith('HEIC'))
        .filter(filename => !filename.endsWith('heic'))

    const data_set = new Set(highlights_list)
    const directory_set = new Set(file_in_directory)

    if (data_set.size !== directory_set.size) {
        console.log(`number of items in names array (${data_set.size})
        doesn't match the number of files in images folder (${directory_set.size})`)
        process.exit(1)
    }

    const dir_has_all_names = [...data_set].every(file => {
        if (directory_set.has(file)) return true
        console.log('no such file in images dir: ', file)
    })

    if (dir_has_all_names) {
        console.log("All images from highlights list are present in directory.")
    } else {
        console.log("WARNING: The array does not match the directory contents.")
        process.exit(1)
    }
}

const compare_highlights_with_bldgs_data = (highlights_list, bldgs_handmade_data) => {
    const all_images_names_in_handmade_data = Object.values(bldgs_handmade_data)
        .flatMap(feature => feature.images || [])
    const missing_highlights = highlights_list.filter(
        hl_name => !all_images_names_in_handmade_data.includes(hl_name)
    )
    if (missing_highlights.length > 0) {
        console.log('Missing highlights:')
        missing_highlights.forEach(hl => console.log(hl))
        process.exit(1)
    } else {
        console.log('All highlights are present in buildings handmade data.')
    }
}




Promise.all([
    import('../js/highlights_images_list.mjs'),
    import('../data/static/bldgs_handmade_data.mjs')
]).then(([highlights_list, { bldgs_handmade_data }]) => {
    highlights_list = highlights_list.images_names.map(name => {
        return name.replace('heic', 'jpg').replace('HEIC', 'jpg')
    })

    compare_highlights_with_directory(
        'dalat-map-images/orig-highlights',
        highlights_list
    )

    compare_highlights_with_bldgs_data(
        highlights_list,
        bldgs_handmade_data
    )
    
})
