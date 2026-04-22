import type { Product, Selection } from '~/lib/types'

interface Props {
  product: Product
  category: Selection['category']
  selections: Selection[]
  onToggle: (selection: Selection) => void
}

export function ProductCard({ product, category, selections, onToggle }: Props) {
  const selectedVariant = selections.find(s => s.productId === product.id)

  return (
    <div
      className="border rounded-xl p-4 transition-all"
      style={selectedVariant
        ? { borderColor: '#FF9F0A', backgroundColor: '#2C2C2E' }
        : { borderColor: '#3A3A3C', backgroundColor: '#2C2C2E' }
      }
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-semibold" style={{ color: '#FFFFFF' }}>{product.model}</div>
          <div className="text-sm" style={{ color: '#AEAEB2' }}>{product.year}</div>
        </div>
        {selectedVariant && (
          <span className="font-semibold text-sm" style={{ color: '#FF9F0A' }}>
            NT${selectedVariant.price_twd.toLocaleString()}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {product.variants.map(variant => {
          const isSelected = selectedVariant?.variant === variant.storage
          return (
            <button
              key={variant.storage}
              onClick={() =>
                onToggle({
                  productId: product.id,
                  model: product.model,
                  variant: variant.storage,
                  price_twd: variant.price_twd,
                  year: product.year,
                  category,
                })
              }
              className="text-xs px-3 py-1.5 rounded-full border transition-colors"
              style={isSelected
                ? { backgroundColor: '#FF9F0A', color: '#000000', borderColor: '#FF9F0A' }
                : { borderColor: '#3A3A3C', color: '#AEAEB2' }
              }
            >
              {variant.storage}
            </button>
          )
        })}
      </div>
    </div>
  )
}
