import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const OUTPUT_DIR = 'public/images/products'
if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true })

const IMAGE_MAP = {
  'iphone-17-pro-max': 'iphone-17-pro-max-finish-select-202509-desert-titanium',
  'iphone-17-pro': 'iphone-17-pro-finish-select-202509-desert-titanium',
  'iphone-17-plus': 'iphone-17-finishselect-202509-6-9inch-teal',
  'iphone-17': 'iphone-17-finishselect-202509-6-1inch-teal',
  'iphone-16e': 'iphone-16e-finishselect-202502-teal',
  'iphone-16-pro-max': 'iphone-16-pro-max-finish-select-202409-deserttitanium',
  'iphone-16-pro': 'iphone-16-pro-finish-select-202409-deserttitanium',
  'iphone-16-plus': 'iphone-16-plus-finish-select-202409-6-7inch-ultramarine',
  'iphone-16': 'iphone-16-finish-select-202409-6-1inch-ultramarine',
  'iphone-15-pro-max': 'iphone-15-pro-max-naturaltitanium-select',
  'iphone-15-pro': 'iphone-15-pro-naturaltitanium-select',
  'iphone-15-plus': 'iphone-15-plus-blue-select-2023',
  'iphone-15': 'iphone-15-blue-select-2023',
  'iphone-14-pro-max': 'iphone-14-pro-max-deeptitanium-select',
  'iphone-14-pro': 'iphone-14-pro-deeptitanium-select',
  'iphone-14-plus': 'iphone-14-plus-purple-select',
  'iphone-14': 'iphone-14-purple-select',
  'iphone-13-pro-max': 'iphone-13-pro-max-sierrablue-select',
  'iphone-13-pro': 'iphone-13-pro-sierrablue-select',
  'iphone-13-mini': 'iphone-13-mini-blue-select-2021',
  'iphone-13': 'iphone-13-blue-select-2021',
  'iphone-12-pro-max': 'iphone-12-pro-max-pacific-blue-select',
  'iphone-12-pro': 'iphone-12-pro-pacific-blue-select',
  'iphone-12-mini': 'iphone-12-mini-blue-select-2020',
  'iphone-12': 'iphone-12-blue-select-2020',
  'macbook-air-13-m4': 'macbook-air-m4-13-starlight-select-202503',
  'macbook-air-15-m4': 'macbook-air-m4-15-starlight-select-202503',
  'macbook-pro-14-m4': 'mbp-14-spaceblack-select-202410',
  'macbook-pro-16-m4-pro': 'mbp-16-spaceblack-select-202410',
  'imac-m4': 'imac-24-blue-select-202410',
  'mac-mini-m4': 'mac-mini-select-202410-silver',
  'mac-studio-m4-max': 'mac-studio-select-202503',
  'ipad-pro-13-m4': 'ipad-pro-13-select-cell-202405-silver',
  'ipad-pro-11-m4': 'ipad-pro-11-select-cell-202405-silver',
  'ipad-air-13-m3': 'ipad-air-13-m3-select-202503-blue',
  'ipad-air-11-m3': 'ipad-air-11-m3-select-202503-blue',
  'ipad-mini-7': 'ipad-mini-select-202409-blue',
  'ipad-10': 'ipad-10gen-blue-select-202212',
  'vision-pro': 'sku-109-202401',
  'apple-watch-ultra-2': 'watch-ultra2-49-titanium-ocean-band-select-202309_FV1',
  'apple-watch-s10': 'watch-s10-46-alum-jetblack-nc-sl-202409_FV1',
  'apple-watch-se-2': 'watch-se-40-alum-midnight-nc-sl-202209_FV1',
  'airpods-4-anc': 'airpods-4-select-anc-202409',
  'airpods-4': 'airpods-4-select-202409',
  'airpods-pro-2': 'airpods-pro-2nd-gen-with-magsafe-case-usbc-202309',
  'airpods-max-2': 'airpods-max-select-202409-midnight',
  'homepod-2': 'homepod-2nd-generation-select',
  'homepod-mini': 'homepod-mini-select-yellow-2021',
}

const BASE = 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is'

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
