import type { LoaderFunctionArgs } from 'react-router'
import satori, { init as initSatori } from 'satori/standalone'
import yogaWasm from 'satori/yoga.wasm'
import { initWasm, Resvg } from '@resvg/resvg-wasm'
import resvgWasm from '@resvg/resvg-wasm/index_bg.wasm'
import { getGrade } from '~/lib/calculations'
import { OgCard } from '~/components/OgCard'

const FONT_CHARS =
  '我的稅蘋果路人愛好者深度使信徒最建議你去上班花 ★NT$ACTim Cookl0123456789,.iphone-cost.pages.devworksaaa26905677'

let wasmReady: Promise<void> | null = null
let fontCache: { name: string; data: ArrayBuffer; weight: 400 | 700; style: 'normal' }[] | null =
  null

function ensureWasm() {
  if (!wasmReady) {
    wasmReady = Promise.all([
      initSatori(yogaWasm),
      initWasm(resvgWasm).catch((e: unknown) => {
        if (!String(e).includes('Already initialized')) throw e
      }),
    ]).then(() => undefined)
  }
  return wasmReady
}

async function ensureFonts() {
  if (fontCache) return fontCache

  const text = encodeURIComponent(FONT_CHARS)

  async function fetchFont(weight: 400 | 700): Promise<ArrayBuffer> {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@${weight}&text=${text}`,
      { headers: { 'User-Agent': 'Mozilla/5.0 (compatible)' } }
    ).then((r) => r.text())

    const match = css.match(/src: url\(['"]?([^'")\s]+)['"]?\) format/)
    if (!match) throw new Error(`Failed to parse Google Fonts CSS: ${css.slice(0, 200)}`)
    return fetch(match[1]).then((r) => r.arrayBuffer())
  }

  const [regular, bold] = await Promise.all([fetchFont(400), fetchFont(700)])
  fontCache = [
    { name: 'Noto Sans TC', data: regular, weight: 400, style: 'normal' },
    { name: 'Noto Sans TC', data: bold, weight: 700, style: 'normal' },
  ]
  return fontCache
}

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url)
    const total = Number(url.searchParams.get('total') ?? '0')
    const grade = getGrade(total)

    const [fonts] = await Promise.all([ensureFonts(), ensureWasm()])

    const svg = await satori(<OgCard total={total} grade={grade} />, {
      width: 1080,
      height: 1080,
      fonts,
    })

    const resvg = new Resvg(svg)
    const png = resvg.render().asPng()

    return new Response(png.buffer as ArrayBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': String(png.length),
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (e) {
    const msg = e instanceof Error ? `${e.message}\n${e.stack}` : String(e)
    return new Response(msg, { status: 500, headers: { 'Content-Type': 'text/plain' } })
  }
}
