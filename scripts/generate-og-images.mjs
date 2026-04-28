import { readFileSync, writeFileSync } from 'fs'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')

const { init: initSatori, default: satori } = await import('satori/standalone')
const { initWasm, Resvg } = await import('@resvg/resvg-wasm')

const yogaWasmPath = join(rootDir, 'node_modules/satori/yoga.wasm')
const resvgWasmPath = join(rootDir, 'node_modules/@resvg/resvg-wasm/index_bg.wasm')

const yogaWasm = readFileSync(yogaWasmPath)
const resvgWasm = readFileSync(resvgWasmPath)

await initSatori(yogaWasm)
await initWasm(resvgWasm).catch(e => {
  if (!String(e).includes('Already initialized')) throw e
})

const grades = [
  { label: '蘋果路人', comment: '還有救', slug: 'passerby' },
  { label: '蘋果愛好者', comment: '正常用戶', slug: 'fan' },
  { label: '蘋果深度使用者', comment: '很認真', slug: 'power-user' },
  { label: '蘋果信徒', comment: '你是死忠', slug: 'believer' },
  { label: 'Tim Cook 最愛的人', comment: '想必收到過感謝信', slug: 'tim-fav' },
  { label: '建議你去 Apple 上班', comment: '直接折抵員工價', slug: 'work-there' },
]

const FONT_CHARS = '花蘋果路人愛好者深度使信徒最建議你去上班 ★Tim Cook有救正常用戶很認真你是死忠想必收到過感謝信直接折抵員工價iphone-cost.luckeverything.com'

async function fetchFont(weight) {
  const text = encodeURIComponent(FONT_CHARS)
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@${weight}&text=${text}`,
    { headers: { 'User-Agent': 'Mozilla/5.0 (compatible)' } }
  ).then(r => r.text())

  const match = css.match(/src: url\(['"]?([^'")\s]+)['"]?\) format/)
  if (!match) throw new Error(`Failed to parse Google Fonts CSS: ${css.slice(0, 200)}`)
  const buf = await fetch(match[1]).then(r => r.arrayBuffer())
  return buf
}

console.log('Fetching fonts...')
const [regular, bold] = await Promise.all([fetchFont(400), fetchFont(700)])
const fonts = [
  { name: 'Noto Sans TC', data: regular, weight: 400, style: 'normal' },
  { name: 'Noto Sans TC', data: bold, weight: 700, style: 'normal' },
]

function makeCard(grade) {
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 1080,
        height: 1080,
        backgroundColor: '#1C1C1E',
        fontFamily: '"Noto Sans TC", sans-serif',
        padding: 80,
        position: 'relative',
      },
      children: [
        {
          type: 'div',
          props: {
            style: { display: 'flex', fontSize: 44, color: '#AEAEB2', marginBottom: 48, fontWeight: 700 },
            children: '花蘋果',
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              backgroundColor: '#FF9F0A',
              color: '#000000',
              fontSize: 52,
              fontWeight: 700,
              paddingTop: 24,
              paddingBottom: 24,
              paddingLeft: 64,
              paddingRight: 64,
              borderRadius: 100,
              marginBottom: 32,
            },
            children: `★ ${grade.label} ★`,
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', fontSize: 36, color: '#AEAEB2' },
            children: grade.comment,
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              position: 'absolute',
              bottom: 48,
              right: 64,
              fontSize: 24,
              color: '#636366',
            },
            children: 'iphone-cost.luckeverything.com',
          },
        },
      ],
    },
  }
}

for (const grade of grades) {
  console.log(`Generating og-grade-${grade.slug}.png ...`)
  const svg = await satori(makeCard(grade), { width: 1080, height: 1080, fonts })
  const resvg = new Resvg(svg)
  const png = resvg.render().asPng()
  const outPath = join(rootDir, 'public', `og-grade-${grade.slug}.png`)
  writeFileSync(outPath, png)
  console.log(`  → saved ${outPath}`)
}

console.log('Done!')
