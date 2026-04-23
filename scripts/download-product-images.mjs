import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const OUTPUT_DIR = 'public/images/products'
if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true })

const BASE = 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is'

const IMAGE_MAP = {
  // iPhone 17
  'iphone-17-pro-max': 'iphone-17-pro-max-select-202509',
  'iphone-17-pro': 'iphone-compare-iphone-17-pro-202509',
  'iphone-17-plus': 'iphone-compare-iphone-air-202509',
  'iphone-17': 'iphone-compare-iphone-17-202509',

  // iPhone 16
  'iphone-16e': 'iphone-compare-iphone-16e-202502',
  'iphone-16-pro': 'iphone-compare-iphone-16-pro-202409',
  'iphone-16-plus': 'iphone-16-plus-black-select-202409',
  'iphone-16': 'iphone-compare-iphone-16-202409',

  // iPhone 15
  'iphone-15-pro-max': 'iphone-15-pro-max-naturaltitanium-select',
  'iphone-15-pro': 'iphone-15-pro-naturaltitanium-select',
  'iphone-15-plus': 'iphone-15-plus-pink-select-202309',
  'iphone-15': 'iphone-15-pink-select-202309',

  // iPhone 14
  'iphone-14-pro-max': 'iphone-14-pro-max-spaceblack-select',
  'iphone-14-pro': 'iphone-compare-iphone-14-pro-202209',
  'iphone-14-plus': 'iphone-14-plus-purple-select-202209',
  'iphone-14': 'iphone-compare-iphone-14-202209',

  // iPhone SE
  'iphone-se-3': 'iphone-compare-iphone-se-202203',
  'iphone-se-2': 'iphone-se-black-select-2020',
  'iphone-se-1': 'iphonese-silver-select-2016',

  // iPhone 13
  'iphone-13-pro-max': 'iphone-13-pro-max-silver-select',
  'iphone-13-pro': 'iphone-compare-iphone-13-pro-202109',
  'iphone-13-mini': 'iphone-13-mini-blue-select-2021',
  'iphone-13': 'iphone-compare-iphone-13-202109',

  // iPhone 12 (Pro variants unavailable on Apple CDN)
  'iphone-12-mini': 'iphone-12-mini-blue-select-2020',
  'iphone-12': 'iphone-12-blue-select-2020',

  // iPhone 11
  'iphone-11-pro-max': 'iphone-11-pro-max-silver-select-2019',
  'iphone-11-pro': 'iphone-11-pro-silver-select-2019',
  'iphone-11': 'iphone11-black-select-2019',

  // iPhone XS/X (XR unavailable)
  'iphone-xs-max': 'iphone-xs-max-gold-select-2018',
  'iphone-xs': 'iphone-xs-gold-select-2018',
  'iphone-x': 'iphone-x-silver-select-2017',

  // iPhone 8/7/6S/6 (6 Plus unavailable)
  'iphone-8-plus': 'iphone8-plus-silver-select-2017',
  'iphone-8': 'iphone8-silver-select-2017',
  'iphone-7-plus': 'iphone7-plus-black-select-2016',
  'iphone-7': 'iphone7-black-select-2016',
  'iphone-6s-plus': 'iphone6s-plus-silver-select-2015',
  'iphone-6s': 'iphone6s-silver-select-2015',
  'iphone-6': 'iphone6-silver-select-2014',

  // MacBook Air (latest category card covers all generations)
  'macbook-air-15-m4': 'mac-card-40-macbook-air-202503',
  'macbook-air-13-m4': 'mac-card-40-macbook-air-202503',
  'macbook-air-15-m2': 'mac-card-40-macbook-air-202503',
  'macbook-air-13-m2': 'mac-card-40-macbook-air-202503',
  'macbook-air-13-m1': 'mac-card-40-macbook-air-202503',

  // MacBook Pro (latest category card covers all generations)
  'macbook-pro-16-m4-max': 'mac-card-40-macbookpro-14-16-202410',
  'macbook-pro-16-m4-pro': 'mac-card-40-macbookpro-14-16-202410',
  'macbook-pro-14-m4-max': 'mac-card-40-macbookpro-14-16-202410',
  'macbook-pro-14-m4-pro': 'mac-card-40-macbookpro-14-16-202410',
  'macbook-pro-14-m4': 'mac-card-40-macbookpro-14-16-202410',
  'macbook-pro-16-m3-max': 'mac-card-40-macbookpro-14-16-202410',
  'macbook-pro-16-m3-pro': 'mac-card-40-macbookpro-14-16-202410',
  'macbook-pro-14-m3-max': 'mac-card-40-macbookpro-14-16-202410',
  'macbook-pro-14-m3-pro': 'mac-card-40-macbookpro-14-16-202410',
  'macbook-pro-14-m3': 'mac-card-40-macbookpro-14-16-202410',
  'macbook-pro-16-m2-max': 'mac-card-40-macbookpro-14-16-202410',
  'macbook-pro-14-m2-pro': 'mac-card-40-macbookpro-14-16-202410',
  'macbook-pro-13-m1': 'mac-card-40-macbookpro-14-16-202410',

  // iMac
  'imac-m4': 'mac-card-40-imac-202410',
  'imac-m3': 'mac-card-40-imac-202410',

  // Mac mini
  'mac-mini-m4-pro': 'mac-card-40-mac-mini-202410',
  'mac-mini-m4': 'mac-card-40-mac-mini-202410',
  'mac-mini-m2-pro': 'mac-card-40-mac-mini-202410',
  'mac-mini-m2': 'mac-card-40-mac-mini-202410',
  'mac-mini-m1': 'mac-card-40-mac-mini-202410',

  // Mac Studio
  'mac-studio-m4-ultra': 'mac-card-40-mac-studio-202503',
  'mac-studio-m4-max': 'mac-card-40-mac-studio-202503',
  'mac-studio-m2-ultra': 'mac-card-40-mac-studio-202503',
  'mac-studio-m2-max': 'mac-card-40-mac-studio-202503',

  // iPad Pro
  'ipad-pro-13-m4': 'ipad-card-40-pro-202405',
  'ipad-pro-11-m4': 'ipad-card-40-pro-202405',
  'ipad-pro-12-m2': 'ipad-card-40-pro-202405',
  'ipad-pro-11-m2': 'ipad-card-40-pro-202405',

  // iPad Air (M2 and M3 share the same card image)
  'ipad-air-13-m3': 'ipad-card-40-air-202405',
  'ipad-air-11-m3': 'ipad-card-40-air-202405',
  'ipad-air-13-m2': 'ipad-card-40-air-202405',
  'ipad-air-11-m2': 'ipad-card-40-air-202405',

  // iPad mini
  'ipad-mini-7': 'ipad-card-40-ipad-mini-202410',
  'ipad-mini-6': 'ipad-card-40-ipad-mini-202410',

  // iPad
  'ipad-10': 'ipad-card-40-ipad-202410',
  'ipad-9': 'ipad-card-40-ipad-202410',

  // Apple Watch Ultra
  'apple-watch-ultra-2': 'watch-compare-ultra3-202509_GEO_TW',
  'apple-watch-ultra-1': 'watch-compare-ultra-202209',

  // Apple Watch Series
  'apple-watch-s10': 'watch-compare-series10-202409',
  'apple-watch-s9': 'watch-compare-series9-202309',
  'apple-watch-s8': 'watch-compare-s8-202209',
  'apple-watch-s7': 'watch-compare-s7-202109',
  'apple-watch-s6': 'watch-compare-s6-202009',

  // Apple Watch SE
  'apple-watch-se-2': 'watch-compare-se-202509',

  // AirPods
  'airpods-4-anc': 'airpods-4-anc-select-202409',
  'airpods-4': 'airpods-4-select-202409',
  'airpods-pro-2': 'MTJV3',
  'airpods-pro-1': 'MWP22',
  'airpods-3': 'MPNY3',
  'airpods-2': 'MV7N2',
  'airpods-max-2': 'airpods-max-select-202409-midnight',

  // HomePod
  'homepod-mini': 'homepod-mini-select-202110',
}

async function download(id, key) {
  const url = `${BASE}/${key}?wid=400&hei=400&fmt=png-alpha&.v=1`
  const outPath = join(OUTPUT_DIR, `${id}.png`)
  try {
    const res = await fetch(url)
    if (!res.ok) { console.warn(`SKIP ${id}: HTTP ${res.status}`); return }
    const buf = await res.arrayBuffer()
    writeFileSync(outPath, Buffer.from(buf))
    console.log(`OK   ${id}`)
  } catch (e) {
    console.warn(`FAIL ${id}: ${e.message}`)
  }
}

for (const [id, key] of Object.entries(IMAGE_MAP)) {
  await download(id, key)
  await new Promise(r => setTimeout(r, 100))
}
console.log('Done.')
