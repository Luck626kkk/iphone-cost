import { useState } from 'react'
import { ProductCard } from './ProductCard'
import { SubscriptionCard } from './SubscriptionCard'
import type { Selection } from '~/lib/types'
import productsData from '../../data/products.json'

const TABS = [
  { key: 'iphone', label: 'iPhone', emoji: '📱' },
  { key: 'mac', label: 'Mac', emoji: '💻' },
  { key: 'ipad', label: 'iPad', emoji: '🖥️' },
  { key: 'wearable', label: '穿戴', emoji: '⌚' },
  { key: 'subscription', label: '訂閱', emoji: '☁️' },
] as const

interface Props {
  selections: Selection[]
  onUpdate: (selection: Selection, quantity: number) => void
}

export function ProductTabs({ selections, onUpdate }: Props) {
  const [activeTab, setActiveTab] = useState<string>('iphone')
  const products = (productsData as Record<string, typeof productsData.iphone>)[activeTab] ?? []
  const category = activeTab as Selection['category']

  return (
    <div>
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
            style={activeTab === tab.key
              ? { backgroundColor: '#FF9F0A', color: '#000000' }
              : { backgroundColor: '#2C2C2E', color: '#AEAEB2', border: '1px solid #3A3A3C' }
            }
          >
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {products.map(product =>
          activeTab === 'subscription'
            ? <SubscriptionCard
                key={product.id}
                product={product}
                selections={selections}
                onUpdate={onUpdate}
              />
            : <ProductCard
                key={product.id}
                product={product}
                category={category}
                selections={selections}
                onUpdate={onUpdate}
              />
        )}
      </div>
    </div>
  )
}
