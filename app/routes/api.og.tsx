import type { LoaderFunctionArgs } from 'react-router'

// @vercel/og is not compatible with Cloudflare Workers
// TODO: replace with satori + @resvg/resvg-wasm for dynamic OG images
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  return Response.redirect(`${url.origin}/og-default.png`, 302)
}
