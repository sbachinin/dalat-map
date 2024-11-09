const fs = require('fs');
const path = require('path');

const highlights_images_list = require('../js/highlights_images_list.js');

function compareArrayWithDirectory(dirPath, arrayToCompare) {
    const filesInDirectory = fs.readdirSync(dirPath)
        .map(file => path.basename(file))
        .filter(filename => !filename.match('Zone.Identifier'));

    const arraySet = new Set(arrayToCompare);
    const directorySet = new Set(filesInDirectory);

    if (arraySet.size !== directorySet.size) {
        console.log(`number of items in names array (${arraySet.size})
        doesn't match the number of files in images folder (${directorySet.size})`)
        return
    }

    const dirHasAllNames = [...arraySet].every(file => {
        if (directorySet.has(file)) return true
        console.log('no such file in images dir: ', file)
    });

    if (dirHasAllNames) {
        console.log("EVERYTHING IS OK");
    } else {
        console.log("WARNING: The array does not match the directory contents.");
    }
}

const directoryPath = 'dalat-map-images/originals';
compareArrayWithDirectory(directoryPath, highlights_images_list);
