import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import heicConvert from 'heic-convert'

const supported_formats = ['.png', '.jpg', '.jpeg', '.gif', '.heic']
const max_area = 800 * 1067 * 2

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

    const output_filename = source_filename.split('.')[0] + '.jpg'
    const city_images_root_folder = source_folder.split('/src')[0] // ...../'cities_images/[cityname]'
    const thumb_img_path = path.join(city_images_root_folder, 'dist', 'thumbs', output_filename)
    const large_img_path = path.join(city_images_root_folder, 'dist', 'large', output_filename)

    if (
        !force
        && fs.existsSync(large_img_path)
        && fs.existsSync(thumb_img_path)
    ) {
        return
    }

    console.log('Processing:', source_file_path)

    let sharp_input = source_file_path
    if (ext === '.heic') {
        const inputBuffer = await fs.promises.readFile(source_file_path)
        sharp_input = await heicConvert({
            buffer: inputBuffer,
            format: 'JPEG',
            quality: 1
        })
    }
    const sharp_image = sharp(sharp_input)
    const metadata = await sharp_image.metadata()

    if (!fs.existsSync(path.dirname(thumb_img_path))) {
        fs.mkdirSync(path.dirname(thumb_img_path), { recursive: true })
    }
    if (!fs.existsSync(path.dirname(large_img_path))) {
        fs.mkdirSync(path.dirname(large_img_path), { recursive: true })
    }

    // 1. Create thumbnail
    const thumb_height = 287
    const thumb_width = Math.round(287 * (metadata.width / metadata.height))
    await sharp_image
        .clone()
        .resize(thumb_width, thumb_height)
        .jpeg({ quality: 95 })
        .toFile(thumb_img_path)

    // 2. Create large image
    const area = Math.min(max_area, metadata.width * metadata.height)
    const ratio = metadata.width / metadata.height
    await sharp_image
        .clone()
        .resize(Math.round(Math.sqrt(area * ratio)),
            Math.round(Math.sqrt(area / ratio)))
        .jpeg({ quality: 95 })
        .toFile(large_img_path)
}



// To run from CLI: "node process_1_image.mjs ../../cities_images/hue/src/highlights/IMG_7326.HEIC"
if (
    import.meta.url === `file://${process.argv[1]}` // running from CLI
    && process.argv.length > 2
) {
    const image_path = process.argv[2]
    const folder = path.dirname(image_path)
    const filename = path.basename(image_path)
    process_image(folder, filename, true).catch(err => {
        console.error('Error processing image:', err)
    })
}
