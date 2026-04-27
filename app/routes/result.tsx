import { useEffect, useState } from 'react'
import { useSearchParams, Link, useLoaderData } from 'react-router'
import type { LoaderFunctionArgs, MetaFunction } from 'react-router'
import { Receipt } from '~/components/Receipt'
import { ShareButtons } from '~/components/ShareButtons'
import { calcTotal, getGrade } from '~/lib/calculations'
import type { Selection } from '~/lib/types'

export async function loader({ request }: LoaderFunctionArgs) {
  const { origin } = new URL(request.url)
  return { origin }
}

export const meta: MetaFunction<typeof loader> = ({ location, data }) => {
  const params = new URLSearchParams(location.search)
  const total = parseInt(params.get('total') ?? '0', 10)
  const formatted = total > 0 ? total.toLocaleString() : '?'
  const origin = data?.origin ?? ''
  const ogUrl = `${origin}/iphone-cost/api/og?total=${total}`

  return [
    { title: total > 0 ? `我在蘋果花了 NT$${formatted} — 花蘋果` : '花蘋果 — 你的 Apple 稅' },
    { name: 'description', content: total > 0 ? `歷年 Apple 花費 NT$${formatted}。你的結果是什麼？` : '計算你歷年貢獻 Apple 多少錢' },
    { property: 'og:title', content: `我在蘋果花了 NT$${formatted}` },
    { property: 'og:description', content: total > 0 ? `歷年 Apple 花費 NT$${formatted}。你的結果是什麼？` : '計算你歷年貢獻 Apple 多少錢' },
    { property: 'og:image', content: ogUrl },
    { property: 'og:image:width', content: '1080' },
    { property: 'og:image:height', content: '1080' },
    { property: 'og:image:type', content: 'image/png' },
    { property: 'og:url', content: `${origin}/iphone-cost/result${location.search}` },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: ogUrl },
  ]
}

export default function Result() {
  const { origin } = useLoaderData<typeof loader>()
  const [selections, setSelections] = useState<Selection[]>([])
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const stored = sessionStorage.getItem('apple-tax-selections')
    if (stored) {
      setSelections(JSON.parse(stored))
    }
  }, [])

  const sharedTotal = searchParams.get('total')
  const total = sharedTotal ? Number(sharedTotal) : calcTotal(selections)
  const grade = getGrade(total)

  const shareUrl = `${origin}/iphone-cost/result?total=${total}&grade=${grade.slug}`

  if (total === 0 && !sharedTotal) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1C1C1E' }}>
        <div className="text-center">
          <p className="mb-4" style={{ color: '#AEAEB2' }}>還沒有選任何產品</p>
          <Link to="/products" style={{ color: '#FF9F0A' }}>回去選產品</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1C1C1E' }}>
      <Receipt selections={selections} total={total} />
      <div className="max-w-sm mx-auto px-4 pb-12">
        <ShareButtons total={total} grade={grade} shareUrl={shareUrl} />
      </div>
    </div>
  )
}
