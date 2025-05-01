import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { cities_meta } from './js/cities_meta.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const source = path.join(__dirname, 'index.html')

let content = fs.readFileSync(source, 'utf8').replace(/"\.\//g, '"../')

Object.entries(cities_meta).forEach(([city, meta]) => {
    if (!meta.html_title) {
        throw new Error(`⚠️ No html_title for ${city}`)
    }

    fs.writeFileSync(
        path.join(__dirname, city, 'index.html'),
        content.replace(/<title>.*?<\/title>/i, `<title>${meta.html_title}</title>`)
    )

    console.log(`Copied dalat/index.html to ${city}/index.html`)
})
