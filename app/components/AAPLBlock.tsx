import type { AAPLResult } from '~/lib/types'

export function AAPLBlock({ aapl }: { aapl: AAPLResult }) {
  const retirementYears = Math.floor(aapl.gain / 370000 / 30)

  return (
    <div>
      <div className="font-semibold text-[#1d1d1f] mb-3">
        📈 如果當年買的是蘋果股票⋯⋯
      </div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-[#6e6e73]">原始投入</span>
        <span>NT${aapl.invested.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-[#6e6e73]">今天市值</span>
        <span className="font-semibold">NT${aapl.currentValue.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-sm mb-3">
        <span className="text-[#6e6e73]">你少賺了</span>
        <span className="text-red-500 font-bold">NT${aapl.gain.toLocaleString()}</span>
      </div>
      {retirementYears > 0 && (
        <div className="text-xs text-[#6e6e73] italic">
          你本可以提早 {retirementYears} 年退休
        </div>
      )}
      <div className="text-xs text-[#6e6e73] mt-2">
        ＊ 固定匯率 USD/TWD 31，娛樂計算用途
      </div>
    </div>
  )
}
