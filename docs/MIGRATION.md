# Migration: luckeverything.com/iphone-cost → iphone-cost.luckeverything.com

## Cloudflare（手動）

1. **刪除舊 Worker Route**
   - Cloudflare Dashboard → luckeverything.com → Workers Routes
   - 刪除 `luckeverything.com/iphone-cost/*`

2. **DNS 與 Custom Domain 由 `wrangler deploy` 自動建立**（見下方 wrangler.toml 變更）

---

## Code 變更

### 1. `wrangler.toml`
加入 custom domain（`wrangler deploy` 時自動建 DNS 並綁定 Worker，繞過 zone WAF）：

```diff
 name = "iphone-cost"
 main = "./workers/app.ts"
 compatibility_date = "2024-09-23"
 compatibility_flags = ["nodejs_compat"]
+
+routes = [
+  { pattern = "iphone-cost.luckeverything.com", custom_domain = true }
+]

 [assets]
 directory = "./build/client"
```

### 2. `react-router.config.ts`
```diff
-  basename: "/iphone-cost",
+  basename: "/",
```

### 3. `workers/app.ts`
移除 `/` redirect（subdomain 上 `/` 直接由 React Router 處理）：

```diff
 export default {
   async fetch(request: Request, env: Env, ctx: ExecutionContext) {
-    const url = new URL(request.url)
-    if (url.pathname === '/') {
-      return Response.redirect(`${url.origin}/iphone-cost/`, 302)
-    }
     return handleRequest({
```

### 4. `app/routes/result.tsx`
```diff
-  const ogUrl = `${origin}/iphone-cost/api/og?total=${total}`
+  const ogUrl = `${origin}/api/og?total=${total}`

-    { property: 'og:url', content: `${origin}/iphone-cost/result${location.search}` },
+    { property: 'og:url', content: `${origin}/result${location.search}` },

-  const shareUrl = `${origin}/iphone-cost/result?total=${total}&grade=${grade.slug}`
+  const shareUrl = `${origin}/result?total=${total}&grade=${grade.slug}`
```

### 5. `app/components/ShareButtons.tsx`
```diff
-    const res = await fetch(`${window.location.origin}/iphone-cost/api/og?total=${total}&grade=${grade.slug}`)
+    const res = await fetch(`${window.location.origin}/api/og?total=${total}&grade=${grade.slug}`)
```

### 6. `app/routes/home.tsx`
```diff
-  { property: 'og:image', content: 'https://luckeverything.com/iphone-cost/og-default.png' },
-  { property: 'og:url', content: 'https://luckeverything.com/iphone-cost/' },
-  { name: 'twitter:image', content: 'https://luckeverything.com/iphone-cost/og-default.png' },
+  { property: 'og:image', content: 'https://iphone-cost.luckeverything.com/og-default.png' },
+  { property: 'og:url', content: 'https://iphone-cost.luckeverything.com/' },
+  { name: 'twitter:image', content: 'https://iphone-cost.luckeverything.com/og-default.png' },
```

### 7. `public/robots.txt`
```diff
 User-agent: Googlebot
-Disallow: /iphone-cost/result
-Disallow: /iphone-cost/api/
+Disallow: /result
+Disallow: /api/

-Sitemap: https://luckeverything.com/iphone-cost/sitemap.xml
+Sitemap: https://iphone-cost.luckeverything.com/sitemap.xml
```

---

## 不用改的

- `app/components/OgCard.tsx` — `iphone-cost.pages.dev` 是 OG 圖片的字型測試字串，非真實 URL
- `app/routes/api.og.tsx` — 同上

---

## 部署順序

1. 做完所有 code 變更
2. `npm run build`
3. git commit & push（GitHub hook 自動 `wrangler deploy`）
4. 去 Cloudflare 刪除舊 Worker Route
5. 測試 `https://iphone-cost.luckeverything.com/`
6. 測試 Facebook Sharing Debugger
