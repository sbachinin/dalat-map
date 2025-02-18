/* 
  GOAL
  Check if I failed to add all available images to handmade data
  Copy them from "large" folder to "missing" folder in order to drop them to browser
*/

import fs from 'fs'
import path from 'path'
import { all_handmade_data } from '../data/static/handmade_data.mjs'

const rejected_imgs = [
  '424.jpg', 'IMG_0475~2.jpg', 'IMG_0613~2.jpg',
  'IMG_0708~4.jpg', 'IMG_0724.jpg', 'IMG_0745~5.jpg',
  'IMG_0758~4.jpg', 'IMG_0808.jpg', 'IMG_1468~5.jpg',
  'IMG_2070~2.jpg', 'IMG_2199.jpg', 'IMG_2259.jpg',
  'IMG_2342~2.jpg', 'IMG_2544~2.jpg', 'IMG_2753.jpg',
  'IMG_3017~2.jpg', 'IMG_3019~2.jpg', 'IMG_3063.JPG',
  'IMG_3195.jpg', 'IMG_3364~2.jpg', 'IMG_3444~2.jpg',
  'IMG_3853~2.jpg', 'IMG_3860~3.jpg', 'IMG_4057~2.jpg',
  'IMG_4169~2.jpg', 'IMG_4682~2.jpg', 'IMG_4701~2.jpg',
  'IMG_4957~3.jpg', 'IMG_5543.jpg', 'IMG_6464~3.jpg',
  'IMG_6489~3.jpg', 'IMG_6681~2 Copy~5.JPG', 'IMG_7070~3.jpg',
  'IMG_7339~2.jpg', 'IMG_7702~2.jpg', 'IMG_7972.jpg',
  'IMG_8275~4.jpg', 'IMG_8387~3.jpg', 'IMG_8412~3.jpg',
  'IMG_8531~3.jpg', 'IMG_8548~2.jpg', 'IMG_8558 Copy~2.JPG',
  'IMG_8580~5.jpg', 'IMG_8848~3.jpg', 'IMG_8854~2.jpg',
  'IMG_8872~2.jpg', 'IMG_9115~2.jpg', 'IMG_9153.jpg',
  'IMG_9495~2.jpg', 'IMG_9547~3.jpg', 'IMG_9564.jpg',
  'IMG_9601~3.jpg', 'IMG_9651~2.jpg', 'IMG_9668~2.jpg',
  'IMG_9747~2.jpg', 'quaint 3storey.jpg', 'IMG_1029~2.jpg',
  "IMG_9681~2.jpg", "IMG_2341.jpg",
  "IMG_2243~2.jpg", "IMG_2840.jpg", "IMG_2258~2.jpg",
  "IMG_2600.jpg", "IMG_7572~5.jpg", "IMG_8683~2.jpg",
  "IMG_8675~4.jpg", "IMG_1855~3.jpg", "IMG_0008~2.jpg",
  "IMG_7957~3.jpg",
  "IMG_2355.jpg",
  "IMG_9314~4.jpg",
  "429.jpg",
  "IMG_4113~2.jpg",
  "IMG_6958 Copy~2.JPG",
  "IMG_4293~2.jpg",
  "IMG_6323~5.jpg",
  "IMG_2134~3.jpg",
  "IMG_6407~2.jpg",
  "IMG_8837~2.jpg",
  "IMG_4716.jpg",
  "IMG_0082~2.JPG",
  "IMG_2014~4.jpg",
  "IMG_8150~2.jpg",
  "IMG_1999.jpg",
  "IMG_0596~3.jpg",
  "IMG_3256.jpg",
  "IMG_0230~3.jpg",
  "IMG_4399.jpg",
  "IMG_0492~3.jpg",
  "IMG_8364~2.jpg",
  "IMG_4050~2.jpg",
  "436~2.jpg",
  "IMG_3192~3.jpg",
  "IMG_4053.jpg",
  "IMG_0489~3.jpg",
  "IMG_7687~3.jpg",
  "IMG_1563~5.jpg",
  "IMG_9137~2.jpg",
  "IMG_3108~3.jpg",
  "IMG_1172~3.jpg",



]

const json_imgs = Object.values(all_handmade_data)
  .flatMap(feature => feature.images || [])

const largeImgDir = path.resolve('../dalat-map-images/large')
const missingImgDir = path.resolve('../dalat-map-images/missing')

if (!fs.existsSync(missingImgDir)) { fs.mkdirSync(missingImgDir) }

const file_imgs = fs.readdirSync(largeImgDir)

const jsonSet = new Set(json_imgs)
const missingInJson = file_imgs.filter(img => {
  return !rejected_imgs.includes(img)
    && !jsonSet.has(img)
})

if (missingInJson.length === 0) {
  console.log('all ok')
}

missingInJson.forEach(img => {
  console.log(img + ' is missing in handmade data')
  const oldPath = path.join(largeImgDir, img)
  const newPath = path.join(missingImgDir, img)

  fs.copyFileSync(oldPath, newPath)
})

