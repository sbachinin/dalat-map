import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import heicConvert from 'heic-convert'
import { is_running_from_cmd_line } from '../build_utils.mjs'

const supported_formats = ['.png', '.jpg', '.jpeg', '.gif', '.heic']
const max_area = 800 * 1067 * 2

const convert_heic_to_jpg = async (inputPath, outputPath) => {
    const inputBuffer = await fs.promises.readFile(inputPath)
    const outputBuffer = await heicConvert({
        buffer: inputBuffer,
        format: 'JPEG',
        quality: 1
    })
    await fs.promises.writeFile(outputPath, outputBuffer)
}

export const process_image = async (source_folder, source_filename, force = false) => {

    // this script can only be run with a path that contains: 'cities_images/[cityname]/src/....'
    const is_valid_path = /cities_images\/[^\/]+\/src/.test(source_folder)
    if (!is_valid_path) {
        console.error('Processed file must be from a valid folder, that is "cities_images/[cityname]/src/...", instead it is:', source_folder)
        process.exit(1)
    }

    const ext = path.extname(source_filename).toLowerCase()
    if (!supported_formats.includes(ext)) {
        console.error('Unsupported image format:', source_filename)
        process.exit(1)
    }

    let source_file_path = path.join(source_folder, source_filename)

    if (ext === '.heic') {
        const jpg_file_path = source_file_path.replace(/\.heic$/i, '.jpg')
        if (force || !fs.existsSync(jpg_file_path)) {
            console.log('Converting HEIC:', source_filename)
            await convert_heic_to_jpg(source_file_path, jpg_file_path)
            source_file_path = jpg_file_path
        } else {
            console.log('Skipping already converted HEIC:', source_filename)
            return
        }
    }

    console.log('Processing:', source_file_path)

    const sharp_image = sharp(source_file_path)
    const metadata = await sharp_image.metadata()

    // Rotate if landscape
    let processed_image = sharp_image
    /* if (metadata.width > metadata.height) {
        console.log('Rotating:', source_file_path)
        processed_image = processed_image.rotate(-90)
    } */

    const output_filename = source_filename.split('.')[0] + '.jpg'

    // city_folder must be a part of sourceFolder string that ends with 'cities_images/[cityname]'
    const city_images_root_folder = source_folder.split('/src')[0]

    const thumb_img_path = path.join(city_images_root_folder, 'dist', 'thumbs', output_filename)
    const large_img_path = path.join(city_images_root_folder, 'dist', 'large', output_filename)

    if (!fs.existsSync(path.dirname(thumb_img_path))) {
        fs.mkdirSync(path.dirname(thumb_img_path), { recursive: true })
    }
    if (!fs.existsSync(path.dirname(large_img_path))) {
        fs.mkdirSync(path.dirname(large_img_path), { recursive: true })
    }

    // 1. Create thumbnail
    if (force || !fs.existsSync(thumb_img_path)) {
        const thumb_height = Math.round(215 / metadata.width * metadata.height)
        await processed_image
            .clone()
            .resize(215, thumb_height)
            .jpeg({ quality: 95 })
            .toFile(thumb_img_path)
    }

    // 2. Create large image
    if (force || !fs.existsSync(large_img_path)) {
        const area = Math.min(max_area, metadata.width * metadata.height)
        const ratio = metadata.width / metadata.height
        const size = [
            Math.round(Math.sqrt(area * ratio)),
            Math.round(Math.sqrt(area / ratio))
        ]
        global.images_sizes[output_filename] = size
        await processed_image
            .clone()
            .resize(...size)
            .jpeg({ quality: 95 })
            .toFile(large_img_path)
    }
}



// To run from CLI: "node process_1_image.mjs ../../cities_images/hue/src/highlights/IMG_7326.HEIC"

if (is_running_from_cmd_line() && process.argv.length > 2) {
    const image_path = process.argv[2]
    const folder = path.dirname(image_path)
    const filename = path.basename(image_path)
    process_image(folder, filename, true).catch(err => {
        console.error('Error processing image:', err)
    })
}
