import React, { useRef, useState, useEffect } from 'react'
import { GradeBadge } from './GradeBadge'
import { AAPLBlock } from './AAPLBlock'
import { ComparisonItems } from './ComparisonItems'
import { getGrade, calcAAPL, getComparisons } from '~/lib/calculations'
import type { Selection } from '~/lib/types'

interface Props {
  selections: Selection[]
  total: number
}

const DIVIDER = '- - - - - - - - - - - - - - -'

export function Receipt({ selections, total }: Props) {
  const [CountUp, setCountUp] = useState<React.ComponentType<{ end: number; duration: number; separator: string; useEasing: boolean }> | null>(null)
  useEffect(() => {
    import('react-countup').then(m => setCountUp(() => m.default))
  }, [])

  const baseYear = selections.length > 0
    ? Math.min(...selections.map(s => s.year))
    : new Date().getFullYear()

  const grade = getGrade(total)
  const aapl = calcAAPL(total, baseYear)
  const comparisons = getComparisons(total)

  const byCategory: Record<string, { label: string; items: Selection[] }> = {
    iphone: { label: 'iPhone', items: [] },
    mac: { label: 'Mac', items: [] },
    ipad: { label: 'iPad', items: [] },
    wearable: { label: '穿戴配件', items: [] },
    subscription: { label: '訂閱服務', items: [] },
  }
  selections.forEach(s => {
    byCategory[s.category]?.items.push(s)
  })

  const receiptRef = useRef<HTMLDivElement>(null)

  return (
    <div className="flex justify-center px-4 py-8">
      <div
        ref={receiptRef}
        id="receipt"
        className="w-full max-w-sm bg-white shadow-lg"
        style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
      >
        <div
          style={{
            height: 12,
            background: 'radial-gradient(circle at 50% 0%, #f5f5f7 6px, #fff 6px)',
            backgroundSize: '20px 12px',
          }}
        />

        <div className="px-6 py-4">
          <div className="text-center mb-4">
            <div className="font-bold text-lg text-[#1d1d1f]">🍎 Apple Store</div>
            <div className="text-sm text-[#6e6e73]">Taipei, Taiwan</div>
            <div className="text-xs text-[#6e6e73]">
              Order #{new Date().toISOString().slice(0, 10)}
            </div>
          </div>

          <div className="text-center text-xs text-[#6e6e73] font-mono mb-4">{DIVIDER}</div>

          {Object.values(byCategory).filter(c => c.items.length > 0).map(cat => {
            const catTotal = cat.items.reduce((s, i) => s + i.price_twd, 0)
            return (
              <div key={cat.label} className="flex justify-between text-sm mb-2">
                <span className="text-[#1d1d1f]">
                  {cat.label}
                  <span className="text-[#6e6e73] ml-1">×{cat.items.length}</span>
                </span>
                <span className="font-mono">NT${catTotal.toLocaleString()}</span>
              </div>
            )
          })}

          <div className="text-center text-xs text-[#6e6e73] font-mono my-4">{DIVIDER}</div>

          <div className="flex justify-between text-sm mb-1">
            <span className="text-[#6e6e73]">小計</span>
            <span className="font-mono">NT${total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm mb-4">
            <span className="text-[#6e6e73]">Apple Tax</span>
            <span className="font-mono text-[#6e6e73]">NT$0.00</span>
          </div>

          <div className="text-center mb-2">
            <div className="text-sm text-[#6e6e73] mb-1">你的 Apple 稅</div>
            <div className="text-4xl font-bold text-[#FF9F0A]">
              {CountUp
                ? <CountUp end={total} duration={1.5} separator="," useEasing />
                : total.toLocaleString()
              }
            </div>
          </div>

          <div className="text-center text-xs text-[#6e6e73] font-mono my-4">{DIVIDER}</div>

          <AAPLBlock aapl={aapl} />

          <div className="text-center text-xs text-[#6e6e73] font-mono my-4">{DIVIDER}</div>

          <GradeBadge grade={grade} />

          <div className="text-center text-xs text-[#6e6e73] font-mono my-4">{DIVIDER}</div>

          {comparisons.length > 0 && (
            <>
              <ComparisonItems items={comparisons} />
              <div className="text-center text-xs text-[#6e6e73] font-mono my-4">{DIVIDER}</div>
            </>
          )}

          <div
            className="h-12 mx-4 mb-4"
            style={{
              background: 'repeating-linear-gradient(90deg, #1d1d1f 0px, #1d1d1f 2px, transparent 2px, transparent 6px)',
            }}
          />

          <div className="text-center text-xs text-[#6e6e73] space-y-1">
            <div>感謝您對 Apple 的無私奉獻</div>
            <div>Tim Cook 已收到您的愛心</div>
            <div className="mt-2 opacity-60">本收據僅供娛樂參考，不具法律效力</div>
          </div>
        </div>

        <div
          style={{
            height: 12,
            background: 'radial-gradient(circle at 50% 100%, #f5f5f7 6px, #fff 6px)',
            backgroundSize: '20px 12px',
          }}
        />
      </div>
    </div>
  )
}
