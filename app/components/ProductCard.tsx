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
      className={`border rounded-xl p-4 cursor-pointer transition-all ${
        selectedVariant
          ? 'border-[#0071e3] bg-blue-50'
          : 'border-gray-200 bg-white hover:border-gray-400'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-semibold text-[#1d1d1f]">{product.model}</div>
          <div className="text-sm text-[#6e6e73]">{product.year}</div>
        </div>
        {selectedVariant && (
          <span className="text-[#0071e3] font-semibold text-sm">
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
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                isSelected
                  ? 'bg-[#0071e3] text-white border-[#0071e3]'
                  : 'border-gray-300 text-[#1d1d1f] hover:border-[#0071e3]'
              }`}
            >
              {variant.storage}
            </button>
          )
        })}
      </div>
    </div>
  )
}
