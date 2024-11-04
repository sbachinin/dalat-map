const fs = require('fs');
const path = require('path');

const highlights_images_list = require('../highlights_images_list.js');

function compareArrayWithDirectory(dirPath, arrayToCompare) {
    const filesInDirectory = fs.readdirSync(dirPath)
        .map(file => path.basename(file))
        .filter(filename => !filename.match('Zone.Identifier'));

    const arraySet = new Set(arrayToCompare);
    const directorySet = new Set(filesInDirectory);

    const isEqual = arraySet.size === directorySet.size && [...arraySet].every(file => {
        return directorySet.has(file)
    });

    if (isEqual) {
        console.log("OK");
    } else {
        console.log("WARNING: The array does not match the directory contents.");
    }
}

const directoryPath = '../dalat-map-images/originals';
compareArrayWithDirectory(directoryPath, highlights_images_list);
