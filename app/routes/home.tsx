import type { MetaFunction } from 'react-router'
import { Link } from 'react-router'
import { LogoMark } from '~/components/LogoMark'

export const meta: MetaFunction = () => [
  { title: '花蘋果 — 你花了多少在蘋果上？' },
  { name: 'description', content: '計算你歷年買 iPhone、Mac、iPad、訂閱服務的總花費，以及如果當初買 AAPL 股票能賺多少。' },
  { property: 'og:title', content: '花蘋果 — 你花了多少在蘋果上？' },
  { property: 'og:description', content: '計算你的蘋果人生花費，結果以 Apple Store 收據樣式呈現。' },
  { property: 'og:image', content: 'https://iphone-cost.pages.dev/og-default.png' },
  { property: 'og:url', content: 'https://iphone-cost.pages.dev/' },
  { name: 'twitter:title', content: '花蘋果 — 你花了多少在蘋果上？' },
  { name: 'twitter:description', content: '計算你歷年貢獻 Apple 多少錢' },
  { name: 'twitter:image', content: 'https://iphone-cost.pages.dev/og-default.png' },
]

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: '#1C1C1E' }}>
      <div className="text-center max-w-sm w-full">
        <div className="flex justify-center mb-6">
          <LogoMark size={80} />
        </div>

        <h1 className="text-3xl font-bold mb-2" style={{ color: '#FFFFFF', fontFamily: "-apple-system, 'PingFang TC', sans-serif" }}>
          花蘋果
        </h1>

        <p className="text-lg mb-2" style={{ color: '#AEAEB2' }}>
          你花了多少在蘋果上？
        </p>

        <p className="text-sm mb-10" style={{ color: '#636366' }}>
          iPhone · Mac · iPad · Apple Watch · 訂閱服務
        </p>

        <Link
          to="/products"
          className="inline-block w-full py-4 rounded-full text-lg font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#FF9F0A', color: '#000000' }}
        >
          開始計算 →
        </Link>

        <div className="mt-8 flex flex-col gap-2 text-xs" style={{ color: '#636366' }}>
          <span>全程不收集個資 · 純前端計算 · 結果可分享</span>
        </div>
      </div>
    </main>
  )
}
