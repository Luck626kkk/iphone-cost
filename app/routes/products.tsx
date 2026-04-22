import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import type { MetaFunction } from 'react-router'
import { ProductTabs } from '~/components/ProductTabs'
import { calcTotal } from '~/lib/calculations'
import type { Selection } from '~/lib/types'

export const meta: MetaFunction = () => [
  { title: '選擇你買過的產品 — 花蘋果' },
]

export default function Products() {
  const [selections, setSelections] = useState<Selection[]>([])
  const navigate = useNavigate()

  const handleToggle = useCallback((incoming: Selection) => {
    setSelections(prev => {
      const exists = prev.find(
        s => s.productId === incoming.productId && s.variant === incoming.variant
      )
      if (exists) {
        return prev.filter(s => !(s.productId === incoming.productId && s.variant === incoming.variant))
      }
      const withoutSameProduct = prev.filter(s => s.productId !== incoming.productId)
      return [...withoutSameProduct, incoming]
    })
  }, [])

  const total = calcTotal(selections)

  const handleCalculate = () => {
    sessionStorage.setItem('apple-tax-selections', JSON.stringify(selections))
    navigate(`/result?total=${total}`)
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#1d1d1f] mb-2">
          選擇你買過的產品
        </h1>
        <p className="text-[#6e6e73] mb-8">可以多選，有幾個選幾個</p>

        <ProductTabs selections={selections} onToggle={handleToggle} />

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div>
              <div className="text-sm text-[#6e6e73]">目前合計</div>
              <div className="text-xl font-bold text-[#0071e3]">
                NT${total.toLocaleString()}
              </div>
            </div>
            <button
              onClick={handleCalculate}
              disabled={selections.length === 0}
              className="bg-[#0071e3] text-white font-semibold px-8 py-3 rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#0077ed] transition-colors"
            >
              計算 →
            </button>
          </div>
        </div>

        <div className="h-24" />
      </div>
    </div>
  )
}
