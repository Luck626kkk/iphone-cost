import type { Grade } from '~/lib/types'

interface Props {
  total: number
  grade: Grade
}

export function OgCard({ total, grade }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 1080,
        height: 1080,
        backgroundColor: '#1C1C1E',
        fontFamily: '-apple-system, "PingFang TC", sans-serif',
        padding: 80,
      }}
    >
      <div style={{ fontSize: 120, marginBottom: 40 }}>🍎</div>

      <div
        style={{
          fontSize: 36,
          color: '#AEAEB2',
          marginBottom: 16,
        }}
      >
        我的 Apple 稅
      </div>

      <div
        style={{
          fontSize: 96,
          fontWeight: 700,
          color: '#FF9F0A',
          marginBottom: 40,
        }}
      >
        NT${total.toLocaleString()}
      </div>

      <div
        style={{
          backgroundColor: '#FF9F0A',
          color: '#000000',
          fontSize: 36,
          fontWeight: 700,
          paddingTop: 16,
          paddingBottom: 16,
          paddingLeft: 48,
          paddingRight: 48,
          borderRadius: 100,
          marginBottom: 24,
        }}
      >
        ★ {grade.label} ★
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 48,
          right: 64,
          fontSize: 24,
          color: '#636366',
        }}
      >
        iphone-cost.pages.dev
      </div>
    </div>
  )
}
