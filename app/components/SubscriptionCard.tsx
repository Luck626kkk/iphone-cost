import { useState } from 'react'
import type { Product, Selection } from '~/lib/types'

interface Props {
  product: Product
  selections: Selection[]
  onUpdate: (selection: Selection, quantity: number) => void
}

export function SubscriptionCard({ product, selections, onUpdate }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [monthsMap, setMonthsMap] = useState<Record<string, number>>({})

  const selectedSubs = selections.filter(s => s.productId === product.id)
  const hasSelection = selectedSubs.length > 0

  const getMonths = (storage: string) => {
    if (monthsMap[storage] !== undefined) return monthsMap[storage]
    const sel = selectedSubs.find(s => s.variant === storage)
    if (sel) {
      const variant = product.variants.find(v => v.storage === storage)
      return variant?.monthly_price_twd ? Math.round(sel.price_twd / variant.monthly_price_twd) : 12
    }
    return 12
  }

  const handleMonthChange = (storage: string, monthlyPrice: number, val: number) => {
    const clamped = Math.max(0, val)
    setMonthsMap(prev => ({ ...prev, [storage]: clamped }))
    onUpdate({
      productId: product.id,
      model: product.model,
      variant: storage,
      price_twd: monthlyPrice * clamped,
      year: product.year,
      category: 'subscription',
      quantity: 1,
    }, clamped > 0 ? 1 : 0)
  }

  return (
    <div
      className="border rounded-xl transition-all"
      style={hasSelection
        ? { borderColor: '#FF9F0A', backgroundColor: '#2C2C2E' }
        : { borderColor: '#3A3A3C', backgroundColor: '#2C2C2E' }
      }
    >
      <button
        className="w-full p-4 flex items-center justify-between text-left"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-3">
          <img
            src={`/images/products/${product.id}.png`}
            alt={product.model}
            className="w-10 h-10 object-contain"
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
          <div>
            <div className="font-semibold" style={{ color: '#FFFFFF' }}>{product.model}</div>
            <div className="text-xs" style={{ color: '#AEAEB2' }}>
              每月 NT${product.variants[0]?.monthly_price_twd?.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {hasSelection && (
            <span className="text-sm font-semibold" style={{ color: '#FF9F0A' }}>
              NT${selectedSubs.reduce((s, i) => s + i.price_twd, 0).toLocaleString()}
            </span>
          )}
          <span style={{ color: '#AEAEB2' }}>{expanded ? '▲' : '▶'}</span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t" style={{ borderColor: '#3A3A3C' }}>
          {product.variants.map(variant => {
            const months = getMonths(variant.storage)
            const monthlyPrice = variant.monthly_price_twd ?? 0
            return (
              <div key={variant.storage} className="flex items-center justify-between py-3 gap-2">
                <div style={{ color: '#AEAEB2' }} className="text-sm">NT${monthlyPrice}/月</div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={months}
                    onChange={e => handleMonthChange(variant.storage, monthlyPrice, parseInt(e.target.value) || 0)}
                    className="w-20 text-center rounded-lg px-2 py-1 text-sm"
                    style={{ backgroundColor: '#1C1C1E', color: '#FFFFFF', border: '1px solid #3A3A3C' }}
                  />
                  <span style={{ color: '#AEAEB2' }} className="text-sm">個月</span>
                </div>
                {months > 0 && (
                  <div className="text-sm font-semibold" style={{ color: '#FF9F0A' }}>
                    NT${(monthlyPrice * months).toLocaleString()}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
