import type { Selection, Grade, ComparisonResult, AAPLResult } from './types'
import aaplData from '../../data/aapl-history.json'
import comparisonsData from '../../data/comparisons.json'

export function calcTotal(selections: Selection[]): number {
  return selections.reduce((sum, s) => sum + s.price_twd * s.quantity, 0)
}

export function getGrade(total: number): Grade {
  if (total < 100000) return { label: '蘋果路人', comment: '還有救', slug: 'passerby' }
  if (total < 300000) return { label: '蘋果愛好者', comment: '正常用戶', slug: 'fan' }
  if (total < 600000) return { label: '蘋果深度使用者', comment: '很認真', slug: 'power-user' }
  if (total < 1000000) return { label: '蘋果信徒', comment: '你是死忠', slug: 'believer' }
  if (total < 2000000) return { label: 'Tim Cook 最愛的人', comment: '想必收到過感謝信', slug: 'tim-fav' }
  return { label: '建議你去 Apple 上班', comment: '直接折抵員工價', slug: 'work-there' }
}

export function calcAAPL(totalTWD: number, baseYear: number): AAPLResult {
  const history = aaplData.AAPL_historical
  const baseEntry = history.find(h => h.year === baseYear)
  const latestEntry = history[history.length - 1]

  if (!baseEntry || baseYear < 2007 || baseYear > latestEntry.year) {
    return { invested: totalTWD, currentValue: totalTWD, gain: 0, baseYear }
  }

  const multiplier = latestEntry.close_usd / baseEntry.close_usd
  const currentValue = Math.round(totalTWD * multiplier)
  return {
    invested: totalTWD,
    currentValue,
    gain: currentValue - totalTWD,
    baseYear,
  }
}

export function getComparisons(total: number): ComparisonResult[] {
  return comparisonsData.comparisons
    .filter(c => c.trigger_min <= total)
    .map(c => ({
      id: c.id,
      name: c.name,
      emoji: c.emoji,
      count: parseFloat((total / c.price_twd).toFixed(1)),
      unit: c.unit,
    }))
}
