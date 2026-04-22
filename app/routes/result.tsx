import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router'
import type { MetaFunction } from 'react-router'
import { Receipt } from '~/components/Receipt'
import { ShareButtons } from '~/components/ShareButtons'
import { calcTotal, getGrade } from '~/lib/calculations'
import type { Selection } from '~/lib/types'

export const meta: MetaFunction = ({ location }) => {
  const params = new URLSearchParams(location.search)
  const total = params.get('total')
  const grade = params.get('grade')
  return [
    { title: total ? `NT$${Number(total).toLocaleString()} — 花蘋果` : '花蘋果 — 你的 Apple 稅' },
    { name: 'description', content: `我的 Apple 稅：NT$${total ?? '???'}，等級：${grade ?? '?'}` },
    { property: 'og:image', content: total ? `/api/og?total=${total}&grade=${grade}` : '' },
  ]
}

export default function Result() {
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

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/result?total=${total}&grade=${grade.slug}`
    : ''

  if (total === 0 && !sharedTotal) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#6e6e73] mb-4">還沒有選任何產品</p>
          <Link to="/products" className="text-[#FF9F0A]">回去選產品</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Receipt selections={selections} total={total} />
      <div className="max-w-sm mx-auto px-4 pb-12">
        <ShareButtons total={total} grade={grade} shareUrl={shareUrl} />
      </div>
    </div>
  )
}
