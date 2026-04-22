import type { ComparisonResult } from '~/lib/types'

export function ComparisonItems({ items }: { items: ComparisonResult[] }) {
  return (
    <div className="space-y-1">
      {items.map(item => (
        <div key={item.id} className="flex items-center gap-2 text-sm">
          <span>{item.emoji}</span>
          <span className="text-[#6e6e73]">
            = {item.count} {item.unit} {item.name}
          </span>
        </div>
      ))}
    </div>
  )
}
