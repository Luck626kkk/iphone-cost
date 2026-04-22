import type { Grade } from '~/lib/types'

interface Props {
  total: number
  grade: Grade
  shareUrl: string
}

export function ShareButtons({ total, grade, shareUrl }: Props) {
  return (
    <div className="mt-6 text-center text-gray-400 text-sm">
      分享功能即將上線…
    </div>
  )
}
