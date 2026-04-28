import { createRequestHandler } from "@react-router/cloudflare";
import * as build from "../build/server";

const handleRequest = createRequestHandler({ build });

const CRAWLER_RE = /facebookexternalhit|Twitterbot|LinkedInBot|Slackbot|TelegramBot|WhatsApp|Discordbot|Googlebot|bingbot|Applebot|line-poker|LineBOT/i;

function crawlerResultHtml(url: URL): Response {
  const total = parseInt(url.searchParams.get('total') ?? '0', 10);
  const grade = url.searchParams.get('grade') ?? 'passerby';
  const formatted = total > 0 ? total.toLocaleString() : '?';
  const ogImage = `${url.origin}/og-grade-${grade}.png`;
  const pageUrl = `${url.origin}/result${url.search}`;
  const title = total > 0 ? `我在蘋果花了 NT$${formatted} — 花蘋果` : '花蘋果 — 你的 Apple 稅';
  const desc = total > 0 ? `歷年 Apple 花費 NT$${formatted}。你的結果是什麼？` : '計算你歷年貢獻 Apple 多少錢';

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta property="og:title" content="我在蘋果花了 NT$${formatted}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1080">
<meta property="og:image:height" content="1080">
<meta property="og:image:type" content="image/png">
<meta property="og:url" content="${pageUrl}">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${ogImage}">
</head><body></body></html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);
    const ua = request.headers.get('user-agent') ?? '';

    if (CRAWLER_RE.test(ua) && url.pathname === '/result') {
      return crawlerResultHtml(url);
    }

    return handleRequest({
      request,
      env,
      waitUntil: ctx.waitUntil.bind(ctx),
      passThroughOnException: ctx.passThroughOnException.bind(ctx),
    });
  },
} satisfies ExportedHandler<Env>;
