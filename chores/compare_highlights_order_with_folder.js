const fs = require('fs')
const path = require('path')

async function load_highlights_list() {
    try {
        const { images_names } = await import('../js/highlights_images_list.mjs');
        return images_names
    } catch (err) {
        console.error('Error loading the module:', err);
    }
}

// To be run after images have been processed
// (=> heic is already converted to jpg)
function compare_array_with_directory(dir_path, highlights_list) {

    highlights_list = highlights_list.map(name => {
        return name.replace('heic', 'jpg').replace('HEIC', 'jpg')
    })

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

load_highlights_list().then((images_names) => {
    compare_array_with_directory(
        'dalat-map-images/orig-highlights',
        images_names
    );
});

