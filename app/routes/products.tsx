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

  const handleUpdate = useCallback((incoming: Selection, quantity: number) => {
    setSelections(prev => {
      if (quantity <= 0) {
        return prev.filter(s =>
          !(s.productId === incoming.productId && s.variant === incoming.variant)
        )
      }
      const exists = prev.find(
        s => s.productId === incoming.productId && s.variant === incoming.variant
      )
      if (exists) {
        return prev.map(s =>
          s.productId === incoming.productId && s.variant === incoming.variant
            ? { ...s, quantity, price_twd: incoming.price_twd }
            : s
        )
      }
      return [...prev, { ...incoming, quantity }]
    })
  }, [])

  const total = calcTotal(selections)

  const handleCalculate = () => {
    sessionStorage.setItem('apple-tax-selections', JSON.stringify(selections))
    navigate(`/result?total=${total}`)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1C1C1E' }}>
      <div className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#FFFFFF', fontFamily: "-apple-system, 'PingFang TC', sans-serif" }}>
          選擇你買過的產品
        </h1>
        <p className="mb-8" style={{ color: '#AEAEB2' }}>可以多選，有幾個選幾個</p>

        <ProductTabs selections={selections} onUpdate={handleUpdate} />

        <div className="fixed bottom-0 left-0 right-0 px-4 py-4" style={{ backgroundColor: '#2C2C2E', borderTop: '1px solid #3A3A3C' }}>
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div>
              <div className="text-sm" style={{ color: '#AEAEB2' }}>目前合計</div>
              <div className="text-xl font-bold" style={{ color: '#FF9F0A' }}>
                NT${total.toLocaleString()}
              </div>
            </div>
            <button
              onClick={handleCalculate}
              disabled={selections.length === 0}
              className="font-semibold px-8 py-3 rounded-full transition-opacity hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#FF9F0A', color: '#000000' }}
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
