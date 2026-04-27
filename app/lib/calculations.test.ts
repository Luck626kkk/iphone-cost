import { describe, it, expect } from 'vitest'
import { calcTotal, getGrade, calcAAPL, getComparisons } from './calculations'
import type { Selection } from './types'

function makeSelection(overrides: Partial<Selection> = {}): Selection {
  return {
    productId: 'test',
    model: 'Test',
    variant: '128GB',
    price_twd: 10000,
    year: 2020,
    category: 'iphone',
    quantity: 1,
    ...overrides,
  }
}

describe('calcTotal', () => {
  it('空選擇回傳 0', () => {
    expect(calcTotal([])).toBe(0)
  })

  it('單一 iPhone 選擇加總正確', () => {
    expect(calcTotal([makeSelection({ price_twd: 36900, year: 2023 })])).toBe(36900)
  })

  it('跨類別多項選擇加總正確', () => {
    const selections: Selection[] = [
      makeSelection({ price_twd: 36900, year: 2023, category: 'iphone' }),
      makeSelection({ price_twd: 38900, year: 2024, category: 'mac' }),
      makeSelection({ price_twd: 3240, year: 2021, category: 'subscription' }),
    ]
    expect(calcTotal(selections)).toBe(79040)
  })

  it('multiplies by quantity', () => {
    const s = makeSelection({ price_twd: 10000, quantity: 3 })
    expect(calcTotal([s])).toBe(30000)
  })

  it('sums multiple selections with different quantities', () => {
    const a = makeSelection({ price_twd: 30000, quantity: 2 })
    const b = makeSelection({ price_twd: 10000, quantity: 1 })
    expect(calcTotal([a, b])).toBe(70000)
  })
})

describe('getGrade', () => {
  it('NT$0 → 蘋果路人', () => {
    expect(getGrade(0).label).toBe('蘋果路人')
  })
  it('NT$99,999 → 蘋果路人', () => {
    expect(getGrade(99999).label).toBe('蘋果路人')
  })
  it('NT$100,000 → 蘋果愛好者', () => {
    expect(getGrade(100000).label).toBe('蘋果愛好者')
  })
  it('NT$299,999 → 蘋果愛好者', () => {
    expect(getGrade(299999).label).toBe('蘋果愛好者')
  })
  it('NT$300,000 → 蘋果深度使用者', () => {
    expect(getGrade(300000).label).toBe('蘋果深度使用者')
  })
  it('NT$599,999 → 蘋果深度使用者', () => {
    expect(getGrade(599999).label).toBe('蘋果深度使用者')
  })
  it('NT$600,000 → 蘋果信徒', () => {
    expect(getGrade(600000).label).toBe('蘋果信徒')
  })
  it('NT$1,000,000 → Tim Cook 最愛的人', () => {
    expect(getGrade(1000000).label).toBe('Tim Cook 最愛的人')
  })
  it('NT$2,000,000 → 建議你去 Apple 上班', () => {
    expect(getGrade(2000000).label).toBe('建議你去 Apple 上班')
  })
})

const sel = (price_twd: number, year: number): Selection => ({
  productId: 'test', model: 'test', variant: '', price_twd, year,
  category: 'iphone', quantity: 1,
})

describe('calcAAPL', () => {
  it('2014 年購買，現值大於投入（股票有漲）', () => {
    const result = calcAAPL([sel(480730, 2014)])
    expect(result.currentValue).toBeGreaterThan(480730)
  })

  it('2023 年購買的倍率小於 2014 年購買', () => {
    const r2014 = calcAAPL([sel(480730, 2014)])
    const r2023 = calcAAPL([sel(480730, 2023)])
    expect(r2023.currentValue).toBeLessThan(r2014.currentValue)
  })

  it('年份 < 2007 → 回傳原始金額', () => {
    const result = calcAAPL([sel(100000, 2000)])
    expect(result.currentValue).toBe(100000)
  })

  it('未來年份 → 回傳原始金額', () => {
    const result = calcAAPL([sel(100000, 2099)])
    expect(result.currentValue).toBe(100000)
  })

  it('gain 等於 currentValue 減去 invested', () => {
    const result = calcAAPL([sel(480730, 2014)])
    expect(result.gain).toBe(result.currentValue - result.invested)
  })

  it('多個產品各自用購買年份計算', () => {
    const mixed = calcAAPL([sel(240365, 2014), sel(240365, 2023)])
    const single2014 = calcAAPL([sel(480730, 2014)])
    expect(mixed.currentValue).toBeLessThan(single2014.currentValue)
  })
})

describe('getComparisons', () => {
  it('NT$5,000 → 沒有符合條件的比較項目', () => {
    const results = getComparisons(5000)
    expect(results.length).toBe(0)
  })

  it('NT$50,000 → 包含 MacBook Pro 比較', () => {
    const results = getComparisons(50000)
    expect(results.some(r => r.id === 'macbook-pro-m5')).toBe(true)
  })

  it('NT$600,000 → 回傳所有比較項目', () => {
    const results = getComparisons(600000)
    expect(results.length).toBeGreaterThanOrEqual(6)
  })

  it('count 計算正確', () => {
    const results = getComparisons(150000)
    const starbucks = results.find(r => r.id === 'starbucks')
    expect(starbucks?.count).toBeCloseTo(150000 / 165, 1)
  })
})
