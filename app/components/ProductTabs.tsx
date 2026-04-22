import { useState } from 'react'
import { ProductCard } from './ProductCard'
import type { Selection } from '~/lib/types'
import productsData from '../../data/products.json'

const TABS = [
  { key: 'iphone', label: 'iPhone', emoji: '📱' },
  { key: 'mac', label: 'Mac', emoji: '💻' },
  { key: 'ipad', label: 'iPad', emoji: '🖥️' },
  { key: 'wearable', label: '穿戴', emoji: '⌚' },
  { key: 'subscription', label: '訂閱', emoji: '☁️' },
] as const

const QUICK_PICKS: Record<string, string[]> = {
  iphone: ['iphone-16-pro-max', 'iphone-13', 'iphone-se-3'],
  mac: ['macbook-air-m3', 'macbook-pro-14-m3', 'mac-mini-m4'],
  ipad: ['ipad-pro-13-m4', 'ipad-air-m2', 'ipad-mini-7'],
  wearable: ['airpods-pro-2', 'apple-watch-s10', 'homepod-mini'],
  subscription: ['icloud-200gb', 'apple-music-individual', 'apple-one'],
}

interface Props {
  selections: Selection[]
  onToggle: (selection: Selection) => void
}

export function ProductTabs({ selections, onToggle }: Props) {
  const [activeTab, setActiveTab] = useState<string>('iphone')

  const products = (productsData as Record<string, typeof productsData.iphone>)[activeTab] ?? []
  const quickPickIds = QUICK_PICKS[activeTab] ?? []
  const quickPicks = products.filter(p => quickPickIds.includes(p.id))
  const remaining = products.filter(p => !quickPickIds.includes(p.id))
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

      {quickPicks.length > 0 && (
        <div className="mb-6">
          <div className="text-xs font-medium mb-3 uppercase tracking-wide" style={{ color: '#636366' }}>
            最常見選擇
          </div>
          <div className="grid gap-3">
            {quickPicks.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                category={category}
                selections={selections}
                onToggle={onToggle}
              />
            ))}
          </div>
        </div>
      )}

      {remaining.length > 0 && (
        <div>
          <div className="text-xs font-medium mb-3 uppercase tracking-wide" style={{ color: '#636366' }}>
            全部型號
          </div>
          <div className="grid gap-3">
            {remaining.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                category={category}
                selections={selections}
                onToggle={onToggle}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
