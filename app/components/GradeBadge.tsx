import type { Grade } from '~/lib/types'

export function GradeBadge({ grade }: { grade: Grade }) {
  return (
    <div className="text-center py-4">
      <div className="inline-block bg-[#FF9F0A] text-black px-6 py-2 rounded-full font-bold text-lg mb-2">
        ★ {grade.label} ★
      </div>
      <div className="text-[#6e6e73] text-sm">「{grade.comment}」</div>
    </div>
  )
}
