import type { Grade } from '~/lib/types'

interface Props {
  total: number
  grade: Grade
  shareUrl: string
}

const SHARE_TEXT = (total: number, grade: Grade, url: string) =>
  `我這輩子貢獻 Apple 了 NT$${total.toLocaleString()} 😱\n等級：★ ${grade.label} ★\n你呢？→ ${url}\n#Apple稅 #蘋果信徒`

export function ShareButtons({ total, grade, shareUrl }: Props) {
  const text = SHARE_TEXT(total, grade, shareUrl)

  const downloadImage = async () => {
    const res = await fetch(`${window.location.origin}/og-grade-${grade.slug}.png`)
    const blob = await res.blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `apple-tax-${total}.png`
    a.click()
  }

  const copyText = () => navigator.clipboard.writeText(text)
  const copyLink = () => navigator.clipboard.writeText(shareUrl)

  return (
    <div className="space-y-3 mt-6">
      <button
        onClick={downloadImage}
        className="w-full font-semibold py-4 rounded-xl transition-colors"
        style={{ backgroundColor: '#FF9F0A', color: '#000000' }}
      >
        📥 下載分享圖片
      </button>

      <div>
        <a
          href={`https://www.threads.net/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          分享 Threads
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={copyText}
          className="border border-gray-300 rounded-xl py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          複製文字
        </button>
        <button
          onClick={copyLink}
          className="border border-gray-300 rounded-xl py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          複製連結
        </button>
      </div>
    </div>
  )
}
