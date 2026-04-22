import sharp from 'sharp'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const svgBuffer = readFileSync(resolve(root, 'doc/og-default.svg'))

await sharp(svgBuffer)
  .resize(1200, 630)
  .png()
  .toFile(resolve(root, 'public/og-default.png'))

console.log('✓ public/og-default.png generated')
