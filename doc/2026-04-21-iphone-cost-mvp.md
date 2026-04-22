# iphone-cost MVP 實作計劃

> **給 AI 執行者：** 必須使用 superpowers:subagent-driven-development（推薦）或 superpowers:executing-plans 逐 Task 執行。步驟使用 checkbox（`- [ ]`）語法追蹤。

**目標：** 打造一個台灣 Apple 用戶的病毒式計算器，讓人算出自己這輩子貢獻 Apple 多少錢，結果以 Apple Store 收據樣式呈現，並可分享 OG 圖片。

**架構：** Remix（React、server-first）部署到 Cloudflare Pages + Cloudflare Workers。產品選擇 UI 是純 client-side React state，存入 sessionStorage。`/api/og` 路由跑在 Cloudflare Worker，用 Satori 生成 1080×1080 PNG 分享卡。所有產品定價資料放在靜態 JSON 檔，不需資料庫、不需 API。

**技術棧：** Remix v2、TypeScript、Tailwind CSS v4、Satori、react-countup、Vitest、Playwright、Cloudflare Pages + Workers

---

## 檔案結構

```
iphone-cost/
├── app/
│   ├── root.tsx                    # 全域 layout、meta tags、Tailwind import
│   ├── entry.client.tsx            # Remix client entry（自動生成）
│   ├── entry.server.tsx            # Remix server entry（自動生成）
│   ├── routes/
│   │   ├── _index.tsx              # / — 歡迎頁
│   │   ├── products.tsx            # /products — 產品選擇（4 個 tab）
│   │   ├── result.tsx              # /result — 收據 + 分享
│   │   └── api.og.tsx              # /api/og — Satori PNG endpoint
│   ├── components/
│   │   ├── ProductTabs.tsx         # Tab 導覽 + 快速選擇 chips
│   │   ├── ProductCard.tsx         # 單一可選產品（含規格選擇）
│   │   ├── Receipt.tsx             # 完整收據 layout（鋸齒邊、條碼、各區塊）
│   │   ├── GradeBadge.tsx          # 等級標籤 + 評語
│   │   ├── AAPLBlock.tsx           # AAPL 股票比較區塊
│   │   ├── ComparisonItems.tsx     # 「= X 台 MacBook Pro M5」等比較項目
│   │   ├── ShareButtons.tsx        # 下載 / Threads / Twitter / 複製按鈕
│   │   └── OgCard.tsx              # Satori 專用 JSX，只能用 inline styles（禁用 Tailwind）
│   └── lib/
│       ├── types.ts                # 共用 TypeScript 型別
│       ├── calculations.ts         # 純函數：calcTotal、getGrade、calcAAPL、getComparisons
│       └── calculations.test.ts    # Vitest 單元測試
├── data/
│   ├── products.json               # 所有 Apple 台灣歷年定價
│   ├── aapl-history.json           # AAPL 年度收盤價 + USD/TWD 匯率
│   └── comparisons.json            # 比較項目（含 trigger_min）
├── test/
│   └── e2e/
│       ├── flow.spec.ts            # 完整流程 E2E 測試
│       └── disabled.spec.ts        # 按鈕 disabled 狀態 E2E 測試
├── public/
│   ├── favicon.svg                 # 收據 + 蘋果咬一口（精簡版）
│   └── og-default.png              # 預設 OG 圖（1200×630）
├── doc/
│   ├── logo.svg                    # 完整 logo mark 設計稿
│   ├── og-default.svg              # OG 圖設計稿（來源）
│   └── design-spec.md              # 配色、字型、設計規格
├── scripts/
│   └── svg-to-png.mjs              # 轉換 og-default.svg → PNG
├── wrangler.toml
├── tailwind.config.ts
├── vite.config.ts
├── vitest.config.ts
└── package.json
```

---

## Task 0：品牌設計資產

> 設計稿已核准（`doc/logo.svg`、`doc/og-default.svg`、`doc/design-spec.md`）。本 Task 將設計稿轉為 app 實際使用的生產檔案。

**品牌名稱：** 花蘋果
**配色：** `#1C1C1E`（背景）、`#FF9F0A`（強調金）、`#FFFFFF`（文字）
**字型：** system font stack（`-apple-system, 'PingFang TC', sans-serif`）

**檔案：**
- 建立：`public/favicon.svg`
- 建立：`public/og-default.png`（從 SVG 轉換）
- 建立：`app/components/LogoMark.tsx`

---

### Step 1：製作精簡版 favicon

Favicon 在 16×16 需要極簡，移除細節文字，只保留收據剪影。

```bash
# 建立 public/ 目錄（如果還沒有）
mkdir -p public
```

建立 `public/favicon.svg`：

```svg
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- 背景 -->
  <rect width="32" height="32" rx="7" fill="#1C1C1E"/>
  <!-- 收據紙 -->
  <rect x="8" y="4" width="16" height="21" rx="2" fill="#FFFFFF"/>
  <!-- 蘋果咬一口（右上角） -->
  <ellipse cx="22" cy="6" rx="5" ry="5.5" fill="#1C1C1E"/>
  <!-- 鋸齒底部 -->
  <path d="M8 22 L8 27 L10 24.5 L12 27 L14 24.5 L16 27 L18 24.5 L20 27 L22 24.5 L24 27 L24 22 Z" fill="#FFFFFF"/>
  <!-- 金色總額條 -->
  <rect x="10" y="18" width="12" height="3" rx="1.5" fill="#FF9F0A"/>
</svg>
```

驗證：在瀏覽器開啟 `public/favicon.svg`，確認在小尺寸下清晰可辨。

---

### Step 2：將 OG 預設圖轉為 PNG

OG 圖需要真正的 PNG 檔，SVG 部分社群平台不支援。用 Node 腳本轉換：

```bash
# 建立 scripts 目錄 + 安裝轉換工具（只在本機用，不進生產依賴）
mkdir -p scripts
npm install -D sharp
```

建立 `scripts/svg-to-png.mjs`：

```js
import sharp from 'sharp'
import { readFileSync } from 'fs'

const svg = readFileSync('doc/og-default.svg')
await sharp(Buffer.from(svg))
  .resize(1200, 630)
  .png()
  .toFile('public/og-default.png')

console.log('✓ public/og-default.png 已輸出')
```

執行：

```bash
node scripts/svg-to-png.mjs
```

預期輸出：`✓ public/og-default.png 已輸出`

用圖片預覽確認：文字清晰、無模糊、背景色 `#1C1C1E` 正確。

---

### Step 3：建立 `LogoMark` 元件

供 app header 和歡迎頁使用。

```tsx
// app/components/LogoMark.tsx
interface Props {
  size?: number
}

export function LogoMark({ size = 40 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="花蘋果 logo"
    >
      <circle cx="60" cy="60" r="60" fill="#1C1C1E" />
      <rect x="32" y="18" width="56" height="72" rx="3" fill="#FFFFFF" />
      <path
        d="M32 82 L32 90 L38 84 L44 90 L50 84 L56 90 L62 84 L68 90 L74 84 L80 90 L86 84 L88 90 L88 82 Z"
        fill="#FFFFFF"
      />
      <ellipse cx="79" cy="23" rx="13" ry="14" fill="#1C1C1E" />
      <path
        d="M79 9 Q85 4 84 10"
        stroke="#1C1C1E"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <rect x="40" y="32" width="28" height="2.5" rx="1.25" fill="#AEAEB2" />
      <rect x="40" y="40" width="36" height="2.5" rx="1.25" fill="#AEAEB2" />
      <rect x="40" y="48" width="30" height="2.5" rx="1.25" fill="#AEAEB2" />
      <rect x="40" y="56" width="36" height="2.5" rx="1.25" fill="#AEAEB2" />
      <rect x="38" y="64" width="44" height="1" fill="#D1D1D6" />
      <rect x="38" y="69" width="44" height="5" rx="2.5" fill="#FF9F0A" />
    </svg>
  )
}
```

---

### Step 4：在 `root.tsx` 加入 favicon link

```tsx
// app/root.tsx — Links function 加入：
{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
```

---

### Step 5：Commit

```bash
git add public/favicon.svg public/og-default.png app/components/LogoMark.tsx scripts/svg-to-png.mjs doc/logo.svg doc/og-default.svg doc/design-spec.md
git commit -m "feat: add brand identity — 花蘋果 logo, favicon, og-default"
```

---

## Task 1：專案初始化

**檔案：**
- 建立：`iphone-cost/`（所有自動生成檔案）
- 建立：`wrangler.toml`
- 建立：`vitest.config.ts`

- [ ] **Step 1：在 GitHub 建立空 repo**

先確認已安裝 GitHub CLI（沒有的話：`brew install gh`）：

```bash
gh auth login   # 第一次使用才需要，跟著瀏覽器 OAuth 走
gh repo create iphone-cost --private --clone
cd iphone-cost
```

> `--clone` 會直接把空 repo clone 到本機，`cd` 進去後就在 git 環境裡了。
> 若要公開 repo，改成 `--public`。

確認：

```bash
git remote -v   # 應該看到 origin → github.com/你的帳號/iphone-cost
```

- [ ] **Step 2：用 Cloudflare Pages 模板建立 Remix 專案**

在剛 clone 的資料夾裡，把 Remix 專案生成到當前目錄（`.`）：

```bash
npx create-remix@latest . --template cloudflare-pages
```

若出現互動式提示，選 TypeScript 和 Cloudflare Pages。

- [ ] **Step 3：確認 `.gitignore` 正確**

`create-remix` 會自動生成 `.gitignore`，確認以下項目都有：

```
node_modules/
build/
.cache/
.env
*.local
```

若缺少，手動補上。

- [ ] **Step 4：首次 commit + push**

```bash
git add .
git commit -m "feat: initialize Remix + Cloudflare Pages project"
git push -u origin main
```

確認：

```bash
gh repo view --web   # 在瀏覽器開啟確認程式碼已上傳
```

- [ ] **Step 5：安裝額外相依套件**

```bash
npm install react-countup @vercel/og @cloudflare/workers-types
npm install -D vitest @vitest/coverage-v8 @testing-library/react @testing-library/jest-dom jsdom @playwright/test tailwindcss @tailwindcss/vite
```

- [ ] **Step 6：在 Vite config 加入 Tailwind v4**

開啟 `vite.config.ts`，改成：

```ts
import { defineConfig } from 'vite'
import { vitePlugin as remix } from '@remix-run/dev'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tailwindcss(),
  ],
})
```

- [ ] **Step 7：建立 Tailwind 樣式並 import 到 root**

建立 `app/tailwind.css`：

```css
@import "tailwindcss";
```

在 `app/root.tsx` import：

```ts
import stylesheet from './tailwind.css?url'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
]
```

- [ ] **Step 8：建立 `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
  },
})
```

建立 `test/setup.ts`：

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 9：建立 `wrangler.toml`**

```toml
name = "iphone-cost"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = "./build/client"
```

- [ ] **Step 10：在 `package.json` 加入 npm scripts**

```json
{
  "scripts": {
    "dev": "remix vite:dev",
    "build": "remix vite:build",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "deploy": "wrangler pages deploy"
  }
}
```

- [ ] **Step 11：確認 dev server 可以啟動**

```bash
npm run dev
```

預期：Server 跑在 `http://localhost:5173`，顯示預設 Remix 頁面。

- [ ] **Step 12：Commit + push**

```bash
git add .
git commit -m "chore: add Tailwind v4, Vitest, wrangler config"
git push
```

---

## Task 2：靜態資料檔

**檔案：**
- 建立：`data/products.json`
- 建立：`data/aapl-history.json`
- 建立：`data/comparisons.json`

**注意：** 以下 iPhone 定價為代表性樣本。正式上線前，請對照 Apple Taiwan 官方存檔（archive.org）或 Mobile01 開賣文章逐一確認。

- [ ] **Step 1：建立 `data/aapl-history.json`**

```json
{
  "AAPL_historical": [
    { "year": 2007, "close_usd": 6.71 },
    { "year": 2008, "close_usd": 2.99 },
    { "year": 2009, "close_usd": 7.08 },
    { "year": 2010, "close_usd": 10.43 },
    { "year": 2011, "close_usd": 13.41 },
    { "year": 2012, "close_usd": 19.02 },
    { "year": 2013, "close_usd": 20.04 },
    { "year": 2014, "close_usd": 27.59 },
    { "year": 2015, "close_usd": 26.32 },
    { "year": 2016, "close_usd": 28.95 },
    { "year": 2017, "close_usd": 42.31 },
    { "year": 2018, "close_usd": 39.44 },
    { "year": 2019, "close_usd": 73.41 },
    { "year": 2020, "close_usd": 132.69 },
    { "year": 2021, "close_usd": 177.57 },
    { "year": 2022, "close_usd": 129.93 },
    { "year": 2023, "close_usd": 192.53 },
    { "year": 2024, "close_usd": 243.04 },
    { "year": 2025, "close_usd": 207.00 }
  ],
  "usd_twd_rate": 31
}
```

⚠️ 上線前請從 Yahoo Finance 確認 2025 年度收盤價。

- [ ] **Step 2：建立 `data/comparisons.json`**

```json
{
  "comparisons": [
    {
      "id": "starbucks",
      "name": "星巴克拿鐵",
      "price_twd": 165,
      "emoji": "☕",
      "unit": "杯",
      "trigger_min": 10000
    },
    {
      "id": "chicken-cutlet",
      "name": "超商雞排年份",
      "price_twd": 18250,
      "emoji": "🍗",
      "unit": "年份的超商雞排",
      "trigger_min": 10000
    },
    {
      "id": "japan-trip",
      "name": "日本旅遊",
      "price_twd": 45000,
      "emoji": "🗼",
      "unit": "次",
      "trigger_min": 30000
    },
    {
      "id": "iphone17-pro-max",
      "name": "iPhone 17 Pro Max",
      "price_twd": 45900,
      "emoji": "📱",
      "unit": "支",
      "trigger_min": 30000
    },
    {
      "id": "macbook-pro-m5",
      "name": "MacBook Pro M5",
      "price_twd": 75000,
      "emoji": "💻",
      "unit": "台",
      "trigger_min": 50000
    },
    {
      "id": "tim-cook-minutes",
      "name": "Tim Cook 分鐘薪水",
      "price_twd": 1141,
      "emoji": "👔",
      "unit": "分鐘",
      "trigger_min": 50000
    },
    {
      "id": "taipei-rent",
      "name": "台北一房月租",
      "price_twd": 25000,
      "emoji": "🏠",
      "unit": "個月",
      "trigger_min": 100000
    },
    {
      "id": "tsmc-share",
      "name": "台積電股票",
      "price_twd": 115000,
      "emoji": "📈",
      "unit": "張",
      "trigger_min": 115000
    }
  ]
}
```

- [ ] **Step 3：建立 `data/products.json`（樣本資料，上線前補完）**

```json
{
  "iphone": [
    {
      "id": "iphone-6",
      "model": "iPhone 6",
      "year": 2014,
      "variants": [
        { "storage": "16GB", "price_twd": 22500 },
        { "storage": "64GB", "price_twd": 25900 },
        { "storage": "128GB", "price_twd": 29500 }
      ]
    },
    {
      "id": "iphone-6s",
      "model": "iPhone 6s",
      "year": 2015,
      "variants": [
        { "storage": "16GB", "price_twd": 23500 },
        { "storage": "64GB", "price_twd": 27900 },
        { "storage": "128GB", "price_twd": 32500 }
      ]
    },
    {
      "id": "iphone-7",
      "model": "iPhone 7",
      "year": 2016,
      "variants": [
        { "storage": "32GB", "price_twd": 23500 },
        { "storage": "128GB", "price_twd": 27900 },
        { "storage": "256GB", "price_twd": 32900 }
      ]
    },
    {
      "id": "iphone-8",
      "model": "iPhone 8",
      "year": 2017,
      "variants": [
        { "storage": "64GB", "price_twd": 24900 },
        { "storage": "256GB", "price_twd": 30900 }
      ]
    },
    {
      "id": "iphone-x",
      "model": "iPhone X",
      "year": 2017,
      "variants": [
        { "storage": "64GB", "price_twd": 35900 },
        { "storage": "256GB", "price_twd": 41900 }
      ]
    },
    {
      "id": "iphone-11",
      "model": "iPhone 11",
      "year": 2019,
      "variants": [
        { "storage": "64GB", "price_twd": 24900 },
        { "storage": "128GB", "price_twd": 27900 },
        { "storage": "256GB", "price_twd": 33900 }
      ]
    },
    {
      "id": "iphone-11-pro",
      "model": "iPhone 11 Pro",
      "year": 2019,
      "variants": [
        { "storage": "64GB", "price_twd": 35900 },
        { "storage": "256GB", "price_twd": 41900 },
        { "storage": "512GB", "price_twd": 50900 }
      ]
    },
    {
      "id": "iphone-12",
      "model": "iPhone 12",
      "year": 2020,
      "variants": [
        { "storage": "64GB", "price_twd": 25900 },
        { "storage": "128GB", "price_twd": 28900 },
        { "storage": "256GB", "price_twd": 34900 }
      ]
    },
    {
      "id": "iphone-13",
      "model": "iPhone 13",
      "year": 2021,
      "variants": [
        { "storage": "128GB", "price_twd": 26900 },
        { "storage": "256GB", "price_twd": 30900 },
        { "storage": "512GB", "price_twd": 38900 }
      ]
    },
    {
      "id": "iphone-14",
      "model": "iPhone 14",
      "year": 2022,
      "variants": [
        { "storage": "128GB", "price_twd": 27900 },
        { "storage": "256GB", "price_twd": 31900 },
        { "storage": "512GB", "price_twd": 39900 }
      ]
    },
    {
      "id": "iphone-15",
      "model": "iPhone 15",
      "year": 2023,
      "variants": [
        { "storage": "128GB", "price_twd": 29900 },
        { "storage": "256GB", "price_twd": 33900 },
        { "storage": "512GB", "price_twd": 41900 }
      ]
    },
    {
      "id": "iphone-15-pro",
      "model": "iPhone 15 Pro",
      "year": 2023,
      "variants": [
        { "storage": "128GB", "price_twd": 36900 },
        { "storage": "256GB", "price_twd": 40900 },
        { "storage": "512GB", "price_twd": 48900 },
        { "storage": "1TB", "price_twd": 56900 }
      ]
    },
    {
      "id": "iphone-15-pro-max",
      "model": "iPhone 15 Pro Max",
      "year": 2023,
      "variants": [
        { "storage": "256GB", "price_twd": 44900 },
        { "storage": "512GB", "price_twd": 52900 },
        { "storage": "1TB", "price_twd": 60900 }
      ]
    },
    {
      "id": "iphone-16",
      "model": "iPhone 16",
      "year": 2024,
      "variants": [
        { "storage": "128GB", "price_twd": 29900 },
        { "storage": "256GB", "price_twd": 33900 },
        { "storage": "512GB", "price_twd": 41900 }
      ]
    },
    {
      "id": "iphone-16-pro",
      "model": "iPhone 16 Pro",
      "year": 2024,
      "variants": [
        { "storage": "128GB", "price_twd": 37900 },
        { "storage": "256GB", "price_twd": 41900 },
        { "storage": "512GB", "price_twd": 49900 },
        { "storage": "1TB", "price_twd": 57900 }
      ]
    },
    {
      "id": "iphone-16-pro-max",
      "model": "iPhone 16 Pro Max",
      "year": 2024,
      "variants": [
        { "storage": "256GB", "price_twd": 45900 },
        { "storage": "512GB", "price_twd": 53900 },
        { "storage": "1TB", "price_twd": 61900 }
      ]
    },
    {
      "id": "iphone-se-3",
      "model": "iPhone SE (3代)",
      "year": 2022,
      "variants": [
        { "storage": "64GB", "price_twd": 14500 },
        { "storage": "128GB", "price_twd": 16500 },
        { "storage": "256GB", "price_twd": 20500 }
      ]
    }
  ],
  "mac": [
    {
      "id": "macbook-air-m1",
      "model": "MacBook Air M1",
      "year": 2020,
      "variants": [
        { "storage": "8GB/256GB", "price_twd": 32900 },
        { "storage": "8GB/512GB", "price_twd": 40900 }
      ]
    },
    {
      "id": "macbook-air-m2",
      "model": "MacBook Air M2",
      "year": 2022,
      "variants": [
        { "storage": "8GB/256GB", "price_twd": 37900 },
        { "storage": "8GB/512GB", "price_twd": 45900 }
      ]
    },
    {
      "id": "macbook-air-m3",
      "model": "MacBook Air M3",
      "year": 2024,
      "variants": [
        { "storage": "8GB/256GB", "price_twd": 38900 },
        { "storage": "16GB/512GB", "price_twd": 52900 }
      ]
    },
    {
      "id": "macbook-pro-14-m3",
      "model": "MacBook Pro 14吋 M3",
      "year": 2023,
      "variants": [
        { "storage": "8GB/512GB", "price_twd": 59900 },
        { "storage": "18GB/512GB", "price_twd": 71900 }
      ]
    },
    {
      "id": "mac-mini-m4",
      "model": "Mac mini M4",
      "year": 2024,
      "variants": [
        { "storage": "16GB/256GB", "price_twd": 19900 },
        { "storage": "24GB/512GB", "price_twd": 27900 }
      ]
    }
  ],
  "ipad": [
    {
      "id": "ipad-10",
      "model": "iPad (10代)",
      "year": 2022,
      "variants": [
        { "storage": "64GB WiFi", "price_twd": 14900 },
        { "storage": "256GB WiFi", "price_twd": 22900 }
      ]
    },
    {
      "id": "ipad-air-m2",
      "model": "iPad Air M2",
      "year": 2024,
      "variants": [
        { "storage": "128GB WiFi", "price_twd": 21900 },
        { "storage": "256GB WiFi", "price_twd": 25900 }
      ]
    },
    {
      "id": "ipad-pro-13-m4",
      "model": "iPad Pro 13吋 M4",
      "year": 2024,
      "variants": [
        { "storage": "256GB WiFi", "price_twd": 43900 },
        { "storage": "512GB WiFi", "price_twd": 51900 }
      ]
    },
    {
      "id": "ipad-mini-7",
      "model": "iPad mini (7代)",
      "year": 2024,
      "variants": [
        { "storage": "128GB WiFi", "price_twd": 16900 },
        { "storage": "256GB WiFi", "price_twd": 20900 }
      ]
    }
  ],
  "wearable": [
    {
      "id": "airpods-pro-2",
      "model": "AirPods Pro (2代)",
      "year": 2022,
      "variants": [
        { "storage": "標準版", "price_twd": 8490 }
      ]
    },
    {
      "id": "airpods-4",
      "model": "AirPods 4",
      "year": 2024,
      "variants": [
        { "storage": "標準版", "price_twd": 5490 }
      ]
    },
    {
      "id": "airpods-max",
      "model": "AirPods Max",
      "year": 2020,
      "variants": [
        { "storage": "標準版", "price_twd": 19490 }
      ]
    },
    {
      "id": "apple-watch-s10",
      "model": "Apple Watch Series 10",
      "year": 2024,
      "variants": [
        { "storage": "42mm", "price_twd": 12900 },
        { "storage": "46mm", "price_twd": 13900 }
      ]
    },
    {
      "id": "apple-watch-ultra-2",
      "model": "Apple Watch Ultra 2",
      "year": 2023,
      "variants": [
        { "storage": "49mm", "price_twd": 29900 }
      ]
    },
    {
      "id": "homepod-2",
      "model": "HomePod (2代)",
      "year": 2023,
      "variants": [
        { "storage": "標準版", "price_twd": 9900 }
      ]
    },
    {
      "id": "homepod-mini",
      "model": "HomePod mini",
      "year": 2020,
      "variants": [
        { "storage": "標準版", "price_twd": 3300 }
      ]
    }
  ],
  "subscription": [
    {
      "id": "apple-music-individual",
      "model": "Apple Music 個人",
      "year": 2015,
      "monthly_price_twd": 150,
      "variants": [
        { "storage": "1年", "years": 1, "price_twd": 1800 },
        { "storage": "2年", "years": 2, "price_twd": 3600 },
        { "storage": "3年", "years": 3, "price_twd": 5400 },
        { "storage": "5年", "years": 5, "price_twd": 9000 }
      ]
    },
    {
      "id": "icloud-50gb",
      "model": "iCloud+ 50GB",
      "year": 2014,
      "monthly_price_twd": 30,
      "variants": [
        { "storage": "1年", "years": 1, "price_twd": 360 },
        { "storage": "3年", "years": 3, "price_twd": 1080 },
        { "storage": "5年", "years": 5, "price_twd": 1800 }
      ]
    },
    {
      "id": "icloud-200gb",
      "model": "iCloud+ 200GB",
      "year": 2014,
      "monthly_price_twd": 90,
      "variants": [
        { "storage": "1年", "years": 1, "price_twd": 1080 },
        { "storage": "3年", "years": 3, "price_twd": 3240 },
        { "storage": "5年", "years": 5, "price_twd": 5400 }
      ]
    },
    {
      "id": "icloud-2tb",
      "model": "iCloud+ 2TB",
      "year": 2016,
      "monthly_price_twd": 330,
      "variants": [
        { "storage": "1年", "years": 1, "price_twd": 3960 },
        { "storage": "3年", "years": 3, "price_twd": 11880 },
        { "storage": "5年", "years": 5, "price_twd": 19800 }
      ]
    },
    {
      "id": "apple-tv-plus",
      "model": "Apple TV+",
      "year": 2019,
      "monthly_price_twd": 170,
      "variants": [
        { "storage": "1年", "years": 1, "price_twd": 2040 },
        { "storage": "2年", "years": 2, "price_twd": 4080 }
      ]
    },
    {
      "id": "apple-one",
      "model": "Apple One 個人",
      "year": 2020,
      "monthly_price_twd": 370,
      "variants": [
        { "storage": "1年", "years": 1, "price_twd": 4440 },
        { "storage": "3年", "years": 3, "price_twd": 13320 }
      ]
    }
  ]
}
```

- [ ] **Step 4：Commit**

```bash
git add data/
git commit -m "feat: add static JSON data for products, AAPL history, comparisons"
```

---

## Task 3：型別定義 + 計算函式庫（TDD）

**檔案：**
- 建立：`app/lib/types.ts`
- 建立：`app/lib/calculations.ts`
- 建立：`app/lib/calculations.test.ts`

- [ ] **Step 1：建立 `app/lib/types.ts`**

```ts
export interface ProductVariant {
  storage: string
  price_twd: number
  years?: number
}

export interface Product {
  id: string
  model: string
  year: number
  variants: ProductVariant[]
}

export interface Selection {
  productId: string
  model: string
  variant: string
  price_twd: number
  year: number
  category: 'iphone' | 'mac' | 'ipad' | 'wearable' | 'subscription'
}

export interface Grade {
  label: string
  comment: string
  slug: string
}

export interface ComparisonResult {
  id: string
  name: string
  emoji: string
  count: number
  unit: string
}

export interface AAPLResult {
  invested: number
  currentValue: number
  gain: number
  baseYear: number
}
```

- [ ] **Step 2：先寫失敗的測試 `app/lib/calculations.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { calcTotal, getGrade, calcAAPL, getComparisons } from './calculations'
import type { Selection } from './types'

const makeSelection = (price_twd: number, year = 2020): Selection => ({
  productId: 'test',
  model: 'Test',
  variant: '128GB',
  price_twd,
  year,
  category: 'iphone',
})

describe('calcTotal', () => {
  it('空選擇回傳 0', () => {
    expect(calcTotal([])).toBe(0)
  })

  it('單一 iPhone 選擇加總正確', () => {
    expect(calcTotal([makeSelection(36900, 2023)])).toBe(36900)
  })

  it('跨類別多項選擇加總正確', () => {
    const selections: Selection[] = [
      { ...makeSelection(36900, 2023), category: 'iphone' },
      { ...makeSelection(38900, 2024), category: 'mac' },
      { ...makeSelection(3240, 2021), category: 'subscription' },
    ]
    expect(calcTotal(selections)).toBe(79040)
  })
})

describe('getGrade', () => {
  it('NT$0 → 蘋果路人', () => {
    expect(getGrade(0).label).toBe('蘋果路人')
  })
  it('NT$99,999 → 蘋果路人', () => {
    expect(getGrade(99999).label).toBe('蘋果路人')
  })
  it('NT$100,000 → 蘋果愛好者', () => {
    expect(getGrade(100000).label).toBe('蘋果愛好者')
  })
  it('NT$299,999 → 蘋果愛好者', () => {
    expect(getGrade(299999).label).toBe('蘋果愛好者')
  })
  it('NT$300,000 → 蘋果深度使用者', () => {
    expect(getGrade(300000).label).toBe('蘋果深度使用者')
  })
  it('NT$599,999 → 蘋果深度使用者', () => {
    expect(getGrade(599999).label).toBe('蘋果深度使用者')
  })
  it('NT$600,000 → 蘋果信徒', () => {
    expect(getGrade(600000).label).toBe('蘋果信徒')
  })
  it('NT$1,000,000 → Tim Cook 最愛的人', () => {
    expect(getGrade(1000000).label).toBe('Tim Cook 最愛的人')
  })
  it('NT$2,000,000 → 建議你去 Apple 上班', () => {
    expect(getGrade(2000000).label).toBe('建議你去 Apple 上班')
  })
})

describe('calcAAPL', () => {
  it('2014 年基準，現值大於投入（股票有漲）', () => {
    const result = calcAAPL(480730, 2014)
    expect(result.currentValue).toBeGreaterThan(480730)
  })

  it('2023 年基準的倍率小於 2014 年基準', () => {
    const r2014 = calcAAPL(480730, 2014)
    const r2023 = calcAAPL(480730, 2023)
    expect(r2023.currentValue).toBeLessThan(r2014.currentValue)
  })

  it('年份 < 2007 → 回傳原始金額', () => {
    const result = calcAAPL(100000, 2000)
    expect(result.currentValue).toBe(100000)
  })

  it('未來年份 → 回傳原始金額', () => {
    const result = calcAAPL(100000, 2099)
    expect(result.currentValue).toBe(100000)
  })

  it('gain 等於 currentValue 減去 invested', () => {
    const result = calcAAPL(480730, 2014)
    expect(result.gain).toBe(result.currentValue - result.invested)
  })
})

describe('getComparisons', () => {
  it('NT$5,000 → 沒有符合條件的比較項目', () => {
    const results = getComparisons(5000)
    expect(results.length).toBe(0)
  })

  it('NT$50,000 → 包含 MacBook Pro 比較', () => {
    const results = getComparisons(50000)
    expect(results.some(r => r.id === 'macbook-pro-m5')).toBe(true)
  })

  it('NT$600,000 → 回傳所有比較項目', () => {
    const results = getComparisons(600000)
    expect(results.length).toBeGreaterThanOrEqual(6)
  })

  it('count 計算正確', () => {
    const results = getComparisons(150000)
    const starbucks = results.find(r => r.id === 'starbucks')
    expect(starbucks?.count).toBeCloseTo(150000 / 165, 1)
  })
})
```

- [ ] **Step 3：執行測試，確認全部失敗**

```bash
npm test
```

預期：所有測試失敗，顯示「Cannot find module './calculations'」

- [ ] **Step 4：建立 `app/lib/calculations.ts`**

```ts
import type { Selection, Grade, ComparisonResult, AAPLResult } from './types'
import aaplData from '../../data/aapl-history.json'
import comparisonsData from '../../data/comparisons.json'

export function calcTotal(selections: Selection[]): number {
  return selections.reduce((sum, s) => sum + s.price_twd, 0)
}

export function getGrade(total: number): Grade {
  if (total < 100000) return { label: '蘋果路人', comment: '還有救', slug: 'passerby' }
  if (total < 300000) return { label: '蘋果愛好者', comment: '正常用戶', slug: 'fan' }
  if (total < 600000) return { label: '蘋果深度使用者', comment: '很認真', slug: 'power-user' }
  if (total < 1000000) return { label: '蘋果信徒', comment: '你是死忠', slug: 'believer' }
  if (total < 2000000) return { label: 'Tim Cook 最愛的人', comment: '想必收到過感謝信', slug: 'tim-fav' }
  return { label: '建議你去 Apple 上班', comment: '直接折抵員工價', slug: 'work-there' }
}

export function calcAAPL(totalTWD: number, baseYear: number): AAPLResult {
  const history = aaplData.AAPL_historical
  const currentYear = new Date().getFullYear()

  const baseEntry = history.find(h => h.year === baseYear)
  const latestEntry = history[history.length - 1]

  if (!baseEntry || baseYear < 2007 || baseYear > currentYear) {
    return { invested: totalTWD, currentValue: totalTWD, gain: 0, baseYear }
  }

  const multiplier = latestEntry.close_usd / baseEntry.close_usd
  const currentValue = Math.round(totalTWD * multiplier)
  return {
    invested: totalTWD,
    currentValue,
    gain: currentValue - totalTWD,
    baseYear,
  }
}

export function getComparisons(total: number): ComparisonResult[] {
  return comparisonsData.comparisons
    .filter(c => c.trigger_min <= total)
    .map(c => ({
      id: c.id,
      name: c.name,
      emoji: c.emoji,
      count: parseFloat((total / c.price_twd).toFixed(1)),
      unit: c.unit,
    }))
}
```

- [ ] **Step 5：再次執行測試，確認全部通過**

```bash
npm test
```

預期：所有測試通過，15 個 case 全綠。

- [ ] **Step 6：Commit**

```bash
git add app/lib/ test/
git commit -m "feat: add calculation functions with full test coverage"
```

---

## Task 4：歡迎頁（`/`）

**檔案：**
- 修改：`app/routes/_index.tsx`

- [ ] **Step 1：把 `app/routes/_index.tsx` 換成歡迎頁**

```tsx
import type { MetaFunction } from '@remix-run/cloudflare'
import { Link } from '@remix-run/react'

export const meta: MetaFunction = () => [
  { title: '你這輩子貢獻蘋果多少錢？' },
  { name: 'description', content: '30 秒算出你的 Apple 稅。從 iPhone、Mac 到訂閱服務全算上。' },
]

export default function Index() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🍎</div>

        <h1 className="text-4xl font-bold text-[#1d1d1f] mb-3 leading-tight">
          你這輩子貢獻蘋果多少錢？
        </h1>

        <p className="text-xl text-[#6e6e73] mb-10">
          30 秒算出你的 Apple 稅
        </p>

        <Link
          to="/products"
          className="inline-block bg-[#0071e3] text-white text-lg font-semibold px-10 py-4 rounded-full hover:bg-[#0077ed] transition-colors"
        >
          開始計算 →
        </Link>

        <div className="mt-8 flex flex-col gap-2 text-sm text-[#6e6e73]">
          <span>✅ 全程不收集個資</span>
          <span>✅ 純前端計算</span>
          <span>✅ 結果可分享</span>
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 2：確認頁面正常渲染**

```bash
npm run dev
```

開瀏覽器確認：標題文字可見、CTA 按鈕可見、按鈕點擊後跳到 `/products`（404 暫時沒關係）。

- [ ] **Step 3：Commit**

```bash
git add app/routes/_index.tsx
git commit -m "feat: add welcome page"
```

---

## Task 5：產品選擇頁（`/products`）

**檔案：**
- 建立：`app/routes/products.tsx`
- 建立：`app/components/ProductTabs.tsx`
- 建立：`app/components/ProductCard.tsx`

- [ ] **Step 1：建立 `app/components/ProductCard.tsx`**

```tsx
import type { Product, Selection } from '~/lib/types'

interface Props {
  product: Product
  category: Selection['category']
  selections: Selection[]
  onToggle: (selection: Selection) => void
}

export function ProductCard({ product, category, selections, onToggle }: Props) {
  const selectedVariant = selections.find(s => s.productId === product.id)

  return (
    <div
      className={`border rounded-xl p-4 cursor-pointer transition-all ${
        selectedVariant
          ? 'border-[#0071e3] bg-blue-50'
          : 'border-gray-200 bg-white hover:border-gray-400'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-semibold text-[#1d1d1f]">{product.model}</div>
          <div className="text-sm text-[#6e6e73]">{product.year}</div>
        </div>
        {selectedVariant && (
          <span className="text-[#0071e3] font-semibold text-sm">
            NT${selectedVariant.price_twd.toLocaleString()}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {product.variants.map(variant => {
          const isSelected = selectedVariant?.variant === variant.storage
          return (
            <button
              key={variant.storage}
              onClick={() =>
                onToggle({
                  productId: product.id,
                  model: product.model,
                  variant: variant.storage,
                  price_twd: variant.price_twd,
                  year: product.year,
                  category,
                })
              }
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                isSelected
                  ? 'bg-[#0071e3] text-white border-[#0071e3]'
                  : 'border-gray-300 text-[#1d1d1f] hover:border-[#0071e3]'
              }`}
            >
              {variant.storage}
            </button>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2：建立 `app/components/ProductTabs.tsx`**

```tsx
import { useState } from 'react'
import { ProductCard } from './ProductCard'
import type { Selection } from '~/lib/types'
import productsData from '../../data/products.json'

const TABS = [
  { key: 'iphone', label: 'iPhone', emoji: '📱' },
  { key: 'mac', label: 'Mac', emoji: '💻' },
  { key: 'ipad', label: 'iPad', emoji: '🖥️' },
  { key: 'wearable', label: '穿戴', emoji: '⌚' },
  { key: 'subscription', label: '訂閱', emoji: '☁️' },
] as const

const QUICK_PICKS: Record<string, string[]> = {
  iphone: ['iphone-16-pro-max', 'iphone-13', 'iphone-se-3'],
  mac: ['macbook-air-m3', 'macbook-pro-14-m3', 'mac-mini-m4'],
  ipad: ['ipad-pro-13-m4', 'ipad-air-m2', 'ipad-mini-7'],
  wearable: ['airpods-pro-2', 'apple-watch-s10', 'homepod-mini'],
  subscription: ['icloud-200gb', 'apple-music-individual', 'apple-one'],
}

interface Props {
  selections: Selection[]
  onToggle: (selection: Selection) => void
}

export function ProductTabs({ selections, onToggle }: Props) {
  const [activeTab, setActiveTab] = useState<string>('iphone')

  const products = (productsData as Record<string, typeof productsData.iphone>)[activeTab] ?? []
  const quickPickIds = QUICK_PICKS[activeTab] ?? []
  const quickPicks = products.filter(p => quickPickIds.includes(p.id))
  const remaining = products.filter(p => !quickPickIds.includes(p.id))
  const category = activeTab as Selection['category']

  return (
    <div>
      {/* Tab 列 */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? 'bg-[#0071e3] text-white'
                : 'bg-white text-[#1d1d1f] border border-gray-200 hover:border-[#0071e3]'
            }`}
          >
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 快速選擇 */}
      {quickPicks.length > 0 && (
        <div className="mb-6">
          <div className="text-xs text-[#6e6e73] font-medium mb-3 uppercase tracking-wide">
            最常見選擇
          </div>
          <div className="grid gap-3">
            {quickPicks.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                category={category}
                selections={selections}
                onToggle={onToggle}
              />
            ))}
          </div>
        </div>
      )}

      {/* 全部型號 */}
      {remaining.length > 0 && (
        <div>
          <div className="text-xs text-[#6e6e73] font-medium mb-3 uppercase tracking-wide">
            全部型號
          </div>
          <div className="grid gap-3">
            {remaining.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                category={category}
                selections={selections}
                onToggle={onToggle}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3：建立 `app/routes/products.tsx`**

```tsx
import { useState, useCallback } from 'react'
import { useNavigate } from '@remix-run/react'
import type { MetaFunction } from '@remix-run/cloudflare'
import { ProductTabs } from '~/components/ProductTabs'
import { calcTotal } from '~/lib/calculations'
import type { Selection } from '~/lib/types'

export const meta: MetaFunction = () => [
  { title: '選擇你買過的產品 — Apple 稅計算器' },
]

export default function Products() {
  const [selections, setSelections] = useState<Selection[]>([])
  const navigate = useNavigate()

  const handleToggle = useCallback((incoming: Selection) => {
    setSelections(prev => {
      const exists = prev.find(
        s => s.productId === incoming.productId && s.variant === incoming.variant
      )
      if (exists) {
        return prev.filter(s => !(s.productId === incoming.productId && s.variant === incoming.variant))
      }
      // 同一產品換規格，不要重複加
      const withoutSameProduct = prev.filter(s => s.productId !== incoming.productId)
      return [...withoutSameProduct, incoming]
    })
  }, [])

  const total = calcTotal(selections)

  const handleCalculate = () => {
    sessionStorage.setItem('apple-tax-selections', JSON.stringify(selections))
    navigate('/result')
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#1d1d1f] mb-2">
          選擇你買過的產品
        </h1>
        <p className="text-[#6e6e73] mb-8">可以多選，有幾個選幾個</p>

        <ProductTabs selections={selections} onToggle={handleToggle} />

        {/* 固定底部列 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div>
              <div className="text-sm text-[#6e6e73]">目前合計</div>
              <div className="text-xl font-bold text-[#0071e3]">
                NT${total.toLocaleString()}
              </div>
            </div>
            <button
              onClick={handleCalculate}
              disabled={selections.length === 0}
              className="bg-[#0071e3] text-white font-semibold px-8 py-3 rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#0077ed] transition-colors"
            >
              計算 →
            </button>
          </div>
        </div>

        {/* 底部 bar 的空白佔位 */}
        <div className="h-24" />
      </div>
    </div>
  )
}
```

- [ ] **Step 4：手動測試產品選擇功能**

```bash
npm run dev
```

步驟：
1. 前往 `/products`
2. 點 iPhone 16 Pro Max → 選 256GB，確認卡片高亮、合計更新
3. 再點一次 256GB，確認取消選擇
4. 點 512GB，確認切換規格（不會疊加）
5. 切換 tab，確認選擇狀態保留
6. 未選任何產品：確認「計算」按鈕呈灰色
7. 有選擇時：確認「計算」按鈕可點擊

- [ ] **Step 5：Commit**

```bash
git add app/routes/products.tsx app/components/
git commit -m "feat: add product selection page with tabs and quick-pick chips"
```

---

## Task 6：結果收據頁（`/result`）

**檔案：**
- 建立：`app/routes/result.tsx`
- 建立：`app/components/Receipt.tsx`
- 建立：`app/components/GradeBadge.tsx`
- 建立：`app/components/AAPLBlock.tsx`
- 建立：`app/components/ComparisonItems.tsx`
- 建立：`app/components/ShareButtons.tsx`（完整實作在 Task 8，這裡先建 stub）

- [ ] **Step 0：先建 `ShareButtons` stub（讓 result.tsx 可以 import）**

result.tsx 需要 import ShareButtons，但完整實作在 Task 8。先建一個佔位版，確保編譯不報錯：

```tsx
// app/components/ShareButtons.tsx — stub，Task 8 會替換成完整版
import type { Grade } from '~/lib/types'

interface Props {
  total: number
  grade: Grade
  shareUrl: string
}

export function ShareButtons({ total, grade, shareUrl }: Props) {
  return (
    <div className="mt-6 text-center text-gray-400 text-sm">
      分享功能實作中…
    </div>
  )
}
```

- [ ] **Step 1：建立 `app/components/GradeBadge.tsx`**

```tsx
import type { Grade } from '~/lib/types'

export function GradeBadge({ grade }: { grade: Grade }) {
  return (
    <div className="text-center py-4">
      <div className="inline-block bg-[#0071e3] text-white px-6 py-2 rounded-full font-bold text-lg mb-2">
        ★ {grade.label} ★
      </div>
      <div className="text-[#6e6e73] text-sm">「{grade.comment}」</div>
    </div>
  )
}
```

- [ ] **Step 2：建立 `app/components/AAPLBlock.tsx`**

```tsx
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
```

- [ ] **Step 3：建立 `app/components/ComparisonItems.tsx`**

```tsx
import type { ComparisonResult } from '~/lib/types'

export function ComparisonItems({ items }: { items: ComparisonResult[] }) {
  return (
    <div className="space-y-1">
      {items.map(item => (
        <div key={item.id} className="flex items-center gap-2 text-sm">
          <span>{item.emoji}</span>
          <span className="text-[#6e6e73]">
            = {item.count} {item.unit} {item.name}
          </span>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4：建立 `app/components/Receipt.tsx`**

```tsx
import { useRef } from 'react'
import CountUp from 'react-countup'
import { GradeBadge } from './GradeBadge'
import { AAPLBlock } from './AAPLBlock'
import { ComparisonItems } from './ComparisonItems'
import { getGrade, calcAAPL, getComparisons } from '~/lib/calculations'
import type { Selection } from '~/lib/types'

interface Props {
  selections: Selection[]
  total: number
}

const DIVIDER = '- - - - - - - - - - - - - - -'

export function Receipt({ selections, total }: Props) {
  const baseYear = selections.length > 0
    ? Math.min(...selections.map(s => s.year))
    : new Date().getFullYear()

  const grade = getGrade(total)
  const aapl = calcAAPL(total, baseYear)
  const comparisons = getComparisons(total)

  const byCategory: Record<string, { label: string; items: Selection[] }> = {
    iphone: { label: 'iPhone', items: [] },
    mac: { label: 'Mac', items: [] },
    ipad: { label: 'iPad', items: [] },
    wearable: { label: '穿戴配件', items: [] },
    subscription: { label: '訂閱服務', items: [] },
  }
  selections.forEach(s => {
    byCategory[s.category]?.items.push(s)
  })

  const receiptRef = useRef<HTMLDivElement>(null)

  return (
    <div className="flex justify-center px-4 py-8">
      <div
        ref={receiptRef}
        id="receipt"
        className="w-full max-w-sm bg-white shadow-lg"
        style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
      >
        {/* 鋸齒上緣 */}
        <div
          style={{
            height: 12,
            background: 'radial-gradient(circle at 50% 0%, #f5f5f7 6px, #fff 6px)',
            backgroundSize: '20px 12px',
          }}
        />

        <div className="px-6 py-4">
          {/* 標頭 */}
          <div className="text-center mb-4">
            <div className="font-bold text-lg text-[#1d1d1f]">🍎 Apple Store</div>
            <div className="text-sm text-[#6e6e73]">Taipei, Taiwan</div>
            <div className="text-xs text-[#6e6e73]">
              Order #{new Date().toISOString().slice(0, 10)}
            </div>
          </div>

          <div className="text-center text-xs text-[#6e6e73] font-mono mb-4">{DIVIDER}</div>

          {/* 明細 */}
          {Object.values(byCategory).filter(c => c.items.length > 0).map(cat => {
            const catTotal = cat.items.reduce((s, i) => s + i.price_twd, 0)
            return (
              <div key={cat.label} className="flex justify-between text-sm mb-2">
                <span className="text-[#1d1d1f]">
                  {cat.label}
                  <span className="text-[#6e6e73] ml-1">×{cat.items.length}</span>
                </span>
                <span className="font-mono">NT${catTotal.toLocaleString()}</span>
              </div>
            )
          })}

          <div className="text-center text-xs text-[#6e6e73] font-mono my-4">{DIVIDER}</div>

          {/* 小計 */}
          <div className="flex justify-between text-sm mb-1">
            <span className="text-[#6e6e73]">小計</span>
            <span className="font-mono">NT${total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm mb-4">
            <span className="text-[#6e6e73]">Apple Tax</span>
            <span className="font-mono text-[#6e6e73]">NT$0.00</span>
          </div>

          {/* 總計 + 數字動畫 */}
          <div className="text-center mb-2">
            <div className="text-sm text-[#6e6e73] mb-1">你的 Apple 稅</div>
            <div className="text-4xl font-bold text-[#0071e3]">
              NT$<CountUp end={total} duration={1.5} separator="," useEasing />
            </div>
          </div>

          <div className="text-center text-xs text-[#6e6e73] font-mono my-4">{DIVIDER}</div>

          {/* AAPL 區塊 */}
          <AAPLBlock aapl={aapl} />

          <div className="text-center text-xs text-[#6e6e73] font-mono my-4">{DIVIDER}</div>

          {/* 等級徽章 */}
          <GradeBadge grade={grade} />

          <div className="text-center text-xs text-[#6e6e73] font-mono my-4">{DIVIDER}</div>

          {/* 比較項目 */}
          {comparisons.length > 0 && (
            <>
              <ComparisonItems items={comparisons} />
              <div className="text-center text-xs text-[#6e6e73] font-mono my-4">{DIVIDER}</div>
            </>
          )}

          {/* 條碼 */}
          <div
            className="h-12 mx-4 mb-4"
            style={{
              background: 'repeating-linear-gradient(90deg, #1d1d1f 0px, #1d1d1f 2px, transparent 2px, transparent 6px)',
            }}
          />

          {/* 頁尾 */}
          <div className="text-center text-xs text-[#6e6e73] space-y-1">
            <div>感謝您對 Apple 的無私奉獻</div>
            <div>Tim Cook 已收到您的愛心</div>
            <div className="mt-2 opacity-60">本收據僅供娛樂參考，不具法律效力</div>
          </div>
        </div>

        {/* 鋸齒下緣 */}
        <div
          style={{
            height: 12,
            background: 'radial-gradient(circle at 50% 100%, #f5f5f7 6px, #fff 6px)',
            backgroundSize: '20px 12px',
          }}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 5：建立 `app/routes/result.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { useSearchParams, Link } from '@remix-run/react'
import type { MetaFunction } from '@remix-run/cloudflare'
import { Receipt } from '~/components/Receipt'
import { ShareButtons } from '~/components/ShareButtons'
import { calcTotal, getGrade } from '~/lib/calculations'
import type { Selection } from '~/lib/types'

export const meta: MetaFunction = ({ location }) => {
  const params = new URLSearchParams(location.search)
  const total = params.get('total')
  const grade = params.get('grade')
  return [
    { title: total ? `NT$${Number(total).toLocaleString()} — Apple 稅計算器` : 'Apple 稅計算器' },
    { name: 'description', content: `我的 Apple 稅：NT$${total ?? '???'}，等級：${grade ?? '?'}` },
    { property: 'og:image', content: total ? `/api/og?total=${total}&grade=${grade}` : '' },
  ]
}

export default function Result() {
  const [selections, setSelections] = useState<Selection[]>([])
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const stored = sessionStorage.getItem('apple-tax-selections')
    if (stored) {
      setSelections(JSON.parse(stored))
    }
  }, [])

  const sharedTotal = searchParams.get('total')
  const total = sharedTotal ? Number(sharedTotal) : calcTotal(selections)
  const grade = getGrade(total)

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/result?total=${total}&grade=${grade.slug}`
    : ''

  if (total === 0 && !sharedTotal) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#6e6e73] mb-4">還沒有選任何產品</p>
          <Link to="/products" className="text-[#0071e3]">回去選產品</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Receipt selections={selections} total={total} />
      <div className="max-w-sm mx-auto px-4 pb-12">
        <ShareButtons total={total} grade={grade} shareUrl={shareUrl} />
      </div>
    </div>
  )
}
```

- [ ] **Step 6：手動驗證結果頁**

1. 前往 `/products`，選 iPhone 15 Pro 256GB，點「計算」
2. 確認收據顯示正確金額 NT$36,900（注意：實際價格依 products.json 內容而定）
3. 確認數字動畫有播放
4. 確認等級徽章顯示「蘋果路人」
5. 確認 AAPL 區塊有數字（currentValue > invested）
6. 直接開 `/result?total=480730&grade=believer`，確認頁面從 URL 參數渲染

- [ ] **Step 7：Commit**

```bash
git add app/routes/result.tsx app/components/Receipt.tsx app/components/GradeBadge.tsx app/components/AAPLBlock.tsx app/components/ComparisonItems.tsx
git commit -m "feat: add receipt result page with count-up, AAPL block, grade badge"
```

---

## Task 7：OG 圖片 Endpoint（`/api/og`）

**檔案：**
- 建立：`app/components/OgCard.tsx`
- 建立：`app/routes/api.og.tsx`

⚠️ **重要：** `OgCard.tsx` 只能用 inline styles，絕對不能用 Tailwind class。Satori 不支援 CSS class 樣式。

- [ ] **Step 1：建立 `app/components/OgCard.tsx`**

```tsx
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
        backgroundColor: '#ffffff',
        fontFamily: '-apple-system, "PingFang TC", sans-serif',
        padding: 80,
      }}
    >
      {/* Apple logo 區域 */}
      <div style={{ fontSize: 120, marginBottom: 40 }}>🍎</div>

      {/* 標籤 */}
      <div
        style={{
          fontSize: 36,
          color: '#6e6e73',
          marginBottom: 16,
        }}
      >
        我的 Apple 稅
      </div>

      {/* 總金額 */}
      <div
        style={{
          fontSize: 96,
          fontWeight: 700,
          color: '#0071e3',
          marginBottom: 40,
        }}
      >
        NT${total.toLocaleString()}
      </div>

      {/* 等級徽章 */}
      <div
        style={{
          backgroundColor: '#0071e3',
          color: '#ffffff',
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

      {/* 浮水印 */}
      <div
        style={{
          position: 'absolute',
          bottom: 48,
          right: 64,
          fontSize: 24,
          color: '#c7c7cc',
        }}
      >
        apptax.tw
      </div>
    </div>
  )
}
```

- [ ] **Step 2：建立 `app/routes/api.og.tsx`**

```ts
import { ImageResponse } from '@vercel/og'
import type { LoaderFunctionArgs } from '@remix-run/cloudflare'
import { getGrade } from '~/lib/calculations'
import { OgCard } from '~/components/OgCard'

export const runtime = 'edge'

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
```


- [ ] **Step 3：確認 OG 圖片可以生成**

```bash
npm run dev
```

開啟：`http://localhost:5173/api/og?total=480730&grade=believer`

預期：PNG 圖片渲染，顯示 NT$480,730、等級徽章、蘋果 emoji。

- [ ] **Step 4：Commit**

```bash
git add app/components/OgCard.tsx app/routes/api.og.tsx
git commit -m "feat: add Satori OG image endpoint"
```

---

## Task 8：分享按鈕

> Task 6 Step 0 已建立 `ShareButtons` stub。這個 Task 用完整實作取代它。

**檔案：**
- 修改：`app/components/ShareButtons.tsx`（取代 Task 6 的 stub）

- [ ] **Step 1：用完整版取代 `app/components/ShareButtons.tsx`**

```tsx
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
    const res = await fetch(`/api/og?total=${total}&grade=${grade.slug}`)
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
        className="w-full bg-[#0071e3] text-white font-semibold py-4 rounded-xl hover:bg-[#0077ed] transition-colors"
      >
        📥 下載分享圖片
      </button>

      <div className="grid grid-cols-2 gap-3">
        <a
          href={`https://www.threads.net/intent/post?text=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          分享 Threads
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          分享 X / Twitter
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
```

- [ ] **Step 2：確認分享按鈕運作正常**

1. 進入結果頁，點「下載分享圖片」，確認 PNG 下載
2. 點「複製文字」，貼到文字編輯器確認格式正確
3. 點「複製連結」，確認 URL 包含 `?total=...&grade=...`
4. 點 Threads 連結，確認開啟 Threads 並帶入預填文字

- [ ] **Step 3：Commit**

```bash
git add app/components/ShareButtons.tsx
git commit -m "feat: add share buttons (download, Threads, Twitter, copy)"
```

---

## Task 9：E2E 測試

**檔案：**
- 建立：`test/e2e/flow.spec.ts`
- 建立：`test/e2e/disabled.spec.ts`
- 建立：`playwright.config.ts`

- [ ] **Step 1：建立 `playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './test/e2e',
  use: {
    baseURL: 'http://localhost:5173',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
```

- [ ] **Step 2：建立 `test/e2e/flow.spec.ts`**

```ts
import { test, expect } from '@playwright/test'

test('完整流程：選 iPhone → 拿到收據', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: '開始計算 →' }).click()

  await expect(page).toHaveURL('/products')

  // 選 iPhone 15 Pro 256GB
  await page.getByText('iPhone 15 Pro').first().waitFor()
  await page.getByText('256GB').first().click()

  // 確認合計更新
  await expect(page.getByText('NT$40,900')).toBeVisible()

  // 點計算
  await page.getByRole('button', { name: '計算 →' }).click()

  await expect(page).toHaveURL('/result')

  // 確認收據渲染
  await expect(page.getByText('你的 Apple 稅')).toBeVisible()
  await expect(page.getByText('NT$')).toBeVisible()
  await expect(page.getByText('★')).toBeVisible()
  await expect(page.getByText('下載分享圖片')).toBeVisible()
})
```

- [ ] **Step 3：建立 `test/e2e/disabled.spec.ts`**

```ts
import { test, expect } from '@playwright/test'

test('未選擇任何產品時計算按鈕應為 disabled', async ({ page }) => {
  await page.goto('/products')

  const button = page.getByRole('button', { name: '計算 →' })
  await expect(button).toBeDisabled()
})
```

- [ ] **Step 4：執行 E2E 測試**

```bash
npm run test:e2e
```

預期：兩個測試都通過。

- [ ] **Step 5：Commit**

```bash
git add test/e2e/ playwright.config.ts
git commit -m "test: add E2E tests for complete flow and disabled state"
```

---

## Task 10：部署到 Cloudflare Pages

**檔案：**
- 修改：`wrangler.toml`

- [ ] **Step 1：Build 專案**

```bash
npm run build
```

預期：Build 完成，產生 `build/` 目錄，內含 `client/` 和 `server/`。

- [ ] **Step 2：登入 Cloudflare**

```bash
npx wrangler login
```

跟著瀏覽器 OAuth 流程完成。

- [ ] **Step 3：建立 Cloudflare Pages 專案（只需一次）**

```bash
npx wrangler pages project create iphone-cost
```

- [ ] **Step 4：部署**

```bash
npm run deploy
```

或直接：

```bash
npx wrangler pages deploy ./build/client --project-name iphone-cost
```

預期輸出包含 `*.pages.dev` 預覽 URL。

- [ ] **Step 5：測試部署後的 URL**

開啟 `*.pages.dev` URL：
1. 完整流程：歡迎頁 → 產品選擇 → 選一個 → 結果頁
2. OG 圖片：`[url]/api/og?total=480730&grade=believer`，確認 PNG 正常渲染
3. 手機：在手機上開啟，確認 RWD 沒有破版

- [ ] **Step 6：在 Cloudflare Dashboard 綁定自訂網域**

1. 前往 `dash.cloudflare.com` → Pages → iphone-cost → Custom domains
2. 加入你的網域
3. DNS 會自動設定（網域已在 Cloudflare 管理）

- [ ] **Step 7：Commit**

```bash
git add wrangler.toml
git commit -m "chore: configure Cloudflare Pages deployment"
```

---

## Task 11：SEO — Meta Tags、OG、robots.txt、sitemap.xml

**檔案：**
- 修改：`app/root.tsx`（追加 meta export，不覆蓋 Task 0 加的 favicon link）
- 修改：`app/routes/_index.tsx`（追加 meta export，不覆蓋 Task 4 的頁面內容）
- 修改：`app/routes/result.tsx`（追加 meta export）
- 建立：`public/robots.txt`
- 建立：`public/sitemap.xml`

---

### Step 1：在 `root.tsx` 加入全域 meta

`root.tsx` 的 `meta` export 作為所有頁面的 fallback。**追加到現有 `links` export 旁邊，不要刪掉 Task 0 加的 favicon link。**

```ts
// app/root.tsx（在現有 export 旁邊加入）
import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => [
  { charset: "utf-8" },
  { name: "viewport", content: "width=device-width, initial-scale=1" },
  { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary_large_image" },
];
```

---

### Step 2：歡迎頁 `/` 的 meta

```ts
// app/routes/_index.tsx
import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => [
  { title: "我在蘋果花了多少錢？" },
  {
    name: "description",
    content:
      "計算你歷年買 iPhone、Mac、iPad、訂閱服務的總花費，以及如果當初買 AAPL 股票能賺多少。",
  },
  { property: "og:title", content: "我在蘋果花了多少錢？" },
  {
    property: "og:description",
    content: "計算你的蘋果人生花費，結果以 Apple Store 收據樣式呈現。",
  },
  {
    property: "og:image",
    content: "https://iphone-cost.pages.dev/og-default.png",
  },
  { property: "og:url", content: "https://iphone-cost.pages.dev/" },
  { name: "twitter:title", content: "我在蘋果花了多少錢？" },
  {
    name: "twitter:description",
    content: "計算你歷年貢獻 Apple 多少錢",
  },
  {
    name: "twitter:image",
    content: "https://iphone-cost.pages.dev/og-default.png",
  },
];
```

---

### Step 3：結果頁 `/result` 的動態 meta

result.tsx 用 sessionStorage 存取選擇，server 端 loader 拿不到。要讓 meta function 能生成動態 OG URL，products 頁跳轉時需要把 total 帶在 URL 參數：

```ts
// app/routes/products.tsx — 計算完跳轉時帶 total
navigate(`/result?total=${calcTotal(selections)}`)
```

這樣 result.tsx 的 meta function 就能從 URL 讀 total，不需要 loader：

```ts
// app/routes/result.tsx — 在現有 export 旁邊加入
import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = ({ location }) => {
  const params = new URLSearchParams(location.search);
  const total = parseInt(params.get("total") ?? "0", 10);
  const formatted = total > 0 ? total.toLocaleString("zh-TW") : "?";
  const ogUrl = `https://iphone-cost.pages.dev/api/og?total=${total}`;

  return [
    { title: total > 0 ? `我在蘋果花了 NT$${formatted}` : "我在蘋果花了多少錢？" },
    {
      name: "description",
      content: total > 0
        ? `歷年 Apple 花費 NT$${formatted}。你的結果是什麼？`
        : "計算你歷年貢獻 Apple 多少錢",
    },
    { property: "og:title", content: `我在蘋果花了 NT$${formatted}` },
    { property: "og:image", content: ogUrl },
    { property: "og:url", content: "https://iphone-cost.pages.dev/result" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: ogUrl },
    { name: "robots", content: "noindex, nofollow" },
  ];
};
```

> **同時確認：** `products.tsx` 的跳轉改成 `navigate(\`/result?total=${calcTotal(selections)}\`)`，total 帶進 URL，result.tsx 的 component 一樣繼續從 sessionStorage 讀完整 selections 做計算。

---

### Step 4：建立 `public/robots.txt`

```
User-agent: *
Allow: /
Disallow: /result
Disallow: /api/

Sitemap: https://iphone-cost.pages.dev/sitemap.xml
```

---

### Step 5：建立 `public/sitemap.xml`

靜態 sitemap，只列歡迎頁（結果頁不收錄）。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://iphone-cost.pages.dev/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://iphone-cost.pages.dev/products</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

> 綁定自訂網域後，把所有 `iphone-cost.pages.dev` 換成正式網域。

---

### Step 6：確認 `public/og-default.png` 存在

`og-default.png` 已在 Task 0 Step 2 用 Sharp 腳本生成。確認檔案存在：

```bash
ls -lh public/og-default.png
```

若不存在（例如剛 clone repo），重新執行：

```bash
node scripts/svg-to-png.mjs
```

---

### Step 7：驗證 OG 標籤

```bash
# 啟動 dev server
npm run dev
```

用以下工具測試：
- [https://www.opengraph.xyz](https://www.opengraph.xyz)（貼入 `http://localhost:5173`）
- LINE 分享測試：LINE 有快取，用 `https://poker.line.naver.jp/` 清快取後測試
- Twitter Card Validator：`https://cards-dev.twitter.com/validator`

確認項目：
- [ ] 首頁 title 正確
- [ ] 首頁 og:image 顯示 `og-default.png`
- [ ] 結果頁 og:image 顯示動態 `/api/og` 圖片
- [ ] 結果頁 `robots: noindex` 有出現在 `<head>`

---

### Step 8：Commit

```bash
git add app/root.tsx app/routes/_index.tsx app/routes/result.tsx \
        public/robots.txt public/sitemap.xml public/og-default.png
git commit -m "feat: add SEO meta tags, robots.txt, sitemap"
```

---

## 上線前檢查清單

### 資料核實（開發期間不用做，上線前必做）
- [ ] 對照 archive.org Apple Taiwan 頁面逐一確認 iPhone 台灣售價
- [ ] 補完 Mac / iPad / 穿戴配件 2014–2025 全型號定價
- [ ] 從 Yahoo Finance 確認 AAPL 2025 年度收盤價
- [ ] 現在就申請 Google AdSense（審核需 1–3 週）

### 法律合規
- [ ] 加入 `/privacy` 路由，放簡單隱私政策頁面
- [ ] 在頁面顯示免責聲明：「本站計算結果僅供娛樂參考」
- [ ] 若有加入信用卡推薦連結，需加附屬連結揭露聲明

### SEO（Task 11 完成後確認）
- [ ] OG 圖片在 LINE 網址預覽中正常顯示（用 LINE Poker 清快取）
- [ ] `sitemap.xml` 和 `robots.txt` 部署後可公開存取
- [ ] 將 sitemap 提交到 Google Search Console
- [ ] 綁定自訂網域後，把 `iphone-cost.pages.dev` 換成正式網域（meta、sitemap）
