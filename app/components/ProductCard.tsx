import { useState } from 'react'
import type { Product, Selection } from '~/lib/types'

interface Props {
  product: Product
  category: Selection['category']
  selections: Selection[]
  onUpdate: (selection: Selection, quantity: number) => void
}

export function ProductCard({ product, category, selections, onUpdate }: Props) {
  const selectedForProduct = selections.filter(s => s.productId === product.id)
  const hasSelection = selectedForProduct.length > 0
  const [expanded, setExpanded] = useState(false)

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
            <div className="text-sm" style={{ color: '#AEAEB2' }}>{product.year}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {hasSelection && (
            <span className="text-sm font-semibold" style={{ color: '#FF9F0A' }}>
              NT${selectedForProduct.reduce((s, i) => s + i.price_twd * i.quantity, 0).toLocaleString()}
            </span>
          )}
          <span style={{ color: '#AEAEB2' }}>{expanded ? '▲' : '▶'}</span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t" style={{ borderColor: '#3A3A3C' }}>
          {product.variants.map(variant => {
            const sel = selectedForProduct.find(s => s.variant === variant.storage)
            const qty = sel?.quantity ?? 0

            return (
              <div key={variant.storage} className="flex items-center justify-between py-2">
                <div>
                  <span className="text-sm" style={{ color: '#FFFFFF' }}>{variant.storage}</span>
                  <span className="text-xs ml-2" style={{ color: '#636366' }}>NT${variant.price_twd.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={qty === 0}
                    onClick={() => onUpdate({
                      productId: product.id, model: product.model,
                      variant: variant.storage, price_twd: variant.price_twd,
                      year: product.year, category, quantity: qty - 1,
                    }, qty - 1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-opacity"
                    style={{ backgroundColor: '#3A3A3C', color: qty === 0 ? '#636366' : '#FFFFFF' }}
                  >−</button>
                  <span className="w-6 text-center text-sm" style={{ color: '#FFFFFF' }}>{qty}</span>
                  <button
                    onClick={() => onUpdate({
                      productId: product.id, model: product.model,
                      variant: variant.storage, price_twd: variant.price_twd,
                      year: product.year, category, quantity: qty + 1,
                    }, qty + 1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold"
                    style={{ backgroundColor: '#FF9F0A', color: '#000000' }}
                  >+</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
