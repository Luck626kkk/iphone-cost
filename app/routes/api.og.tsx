import { ImageResponse } from '@vercel/og'
import type { LoaderFunctionArgs } from 'react-router'
import { getGrade } from '~/lib/calculations'
import { OgCard } from '~/components/OgCard'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const totalParam = url.searchParams.get('total')
  const total = totalParam ? parseInt(totalParam, 10) : 0

  const grade = getGrade(total)

  return new ImageResponse(
    OgCard({ total, grade }),
    {
      width: 1080,
      height: 1080,
    }
  )
}
