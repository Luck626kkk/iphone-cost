# iphone-cost 設計文件

> 版本：1.1 (後 plan-eng-review 更新)
> 日期：2026-04-21  
> 作者：Luck  
> 設計方向：Apple Tax Receipt 收據美學型（Variant B — 白底 + Apple 藍色點綴）

---

## 產品一句話定義

> **「輸入你買過的蘋果產品 → 拿到一張蘋果收據 → 震驚 → 截圖發出去」**

不是計算機。是一張你從來沒收到過的帳單。

---

## 設計決策：為什麼是收據？

一般「計算結果頁」使用者看完就關掉。收據不同：

1. **收據是熟悉的東西**：每個人都買過東西，看到收據格式會自動「讀完」
2. **收據本身就是可截圖的 artifact**：不需要額外說明，拍下來就是梗
3. **蘋果用戶愛自嘲**：「我的蘋果稅收據」比「我的蘋果花費統計」更有傳播力
4. **競品都在做 dashboard**，收據是差異化

---

## 視覺設計規格

### 整體風格

- **底色**：白色 `#FFFFFF`
- **主強調色**：Apple 藍 `#0071e3`（用於 total、grade badge、CTA 按鈕）
- **文字**：深灰 `#1d1d1f`（Apple 官方文字色）
- **次要文字**：中灰 `#6e6e73`
- **收據背景**：淡灰 `#f5f5f7`（頁面底色，收據本身白色帶陰影）
- **字體**：`SF Pro`（macOS/iOS 預設）→ fallback：`-apple-system, BlinkMacSystemFont, 'PingFang TC', 'Noto Sans TC'`

### 收據元素

| 元素 | 設計 |
|---|---|
| 頂部鋸齒邊 | `radial-gradient` 鋸齒效果，模擬撕開的熱感收據 |
| 底部鋸齒邊 | 同上，倒置 |
| 分隔線 | `- - - - - -` 虛線（等寬字體） |
| 條碼 | CSS `repeating-linear-gradient` 模擬，非真實條碼 |
| 陰影 | `box-shadow: 0 4px 20px rgba(0,0,0,0.08)` |
| 圓角 | 無（熱感收據不圓角） |

### 排版

- **收據寬度**：固定 `380px`（手機上 `100% - 32px`）
- **內距**：`24px` 兩側
- **行高**：分項統計用 `1.6`，金額欄右對齊
- **Total 行**：字重 `700`，字號 `28px`，Apple 藍色

---

## 頁面流程（5 步驟）

### Step 1：歡迎頁

```
標題：你這輩子貢獻蘋果多少錢？
副標：30 秒算出你的 Apple 稅
按鈕：開始計算 →
小字：✅ 全程不收集個資  ✅ 純前端計算  ✅ 結果可分享
```

**設計重點**：乾淨、大留白、一個 CTA。背景可放一個淡淡的 Apple logo 剪影。

---

### Step 2–4：產品選擇

分 4 個 tab：iPhone / Mac+iPad / 穿戴配件 / 訂閱服務

**每個分類的 UX 原則**：
- 預設全部未勾選（不 dark pattern）
- 有買的型號點一下勾選，容量/配置在右側出現
- 「跳過這分類」按鈕讓流程保持快速
- 底部顯示「目前合計 NT$ XX,XXX」（實時更新）

---

### Step 3（核心）：收據結果頁

這是整個產品最重要的一頁。佈局從上到下：

```
┌─────────────────────────┐  ← 鋸齒邊
│  🍎 Apple Store         │
│  Taipei, Taiwan         │
│  Order #LUCK-2026-04-21 │
│ - - - - - - - - - - - - │
│  iPhone     3 支  276,830│
│  Mac        1 台   89,000│
│  iPad       1 台   28,900│
│  穿戴配件         52,400 │
│  訂閱服務   6 年   21,600│
│  其他配件         12,000 │
│ - - - - - - - - - - - - │
│  小計             480,730│
│  Apple Tax         0.00  │  ← 梗：蘋果不收稅（美國），所以這行是 0
│ ═══════════════════════ │
│  你的 Apple 稅            │
│  NT$ 480,730      ← 藍色大字，count-up 動畫
│ - - - - - - - - - - - - │
│  📈 如果當年買蘋果股票   │
│  投入   NT$480,730       │
│  今天市值 NT$2,340,000   │
│  你少賺了 NT$1,859,270  │  ← 紅色
│ - - - - - - - - - - - - │
│  ★ 蘋果信徒 ★   ← badge  │  ← 藍色
│  「你是 Tim Cook 最愛的人」│
│ - - - - - - - - - - - - │
│  = 6.4 台 MacBook Pro M5 │
│  = 台北一房 19.2 個月租金 │
│  = 環島 9.6 次           │
│ - - - - - - - - - - - - │
│  ▌▌▌▌▌▌ ▌▌ ▌▌▌ ▌▌▌▌▌▌ │  ← 條碼
│  感謝您對 Apple 的無私奉獻 │
│  Tim Cook 已收到您的愛心  │
└─────────────────────────┘  ← 鋸齒邊
```

---

### 結果頁：各區塊細節

#### 主 Total
- Count-up 動畫：從 0 跳到結果，持續 1.5 秒，`easeOut` 曲線
- 字號 `40px`，字重 `700`，Apple 藍色 `#0071e3`
- 下方小字：「你這輩子已經貢獻 Apple」

#### AAPL 股票對比（主畫面必要功能）
- 顯示：投入金額 / 今天市值 / 你少賺了
- 「你少賺了」以紅色顯示（負面情緒 = 分享驅動力）
- 幽默註解：「你本可以提早 X 年退休」（X = 少賺金額 / 台灣平均年薪 37 萬 / 30）
- 技術：用 AAPL 歷年年度調整後收盤價 JSON，以用戶「第一次購買年份」為基準

#### 用戶等級 Badge
| 金額 | 等級 | 評語 |
|---|---|---|
| < 10 萬 | 蘋果路人 | 還有救 |
| 10–30 萬 | 蘋果愛好者 | 正常用戶 |
| 30–60 萬 | 蘋果深度使用者 | 很認真 |
| 60–100 萬 | 蘋果信徒 | 你是死忠 |
| 100–200 萬 | Tim Cook 最愛的人 | 想必收到過感謝信 |
| > 200 萬 | 建議你去 Apple 上班 | 直接折抵員工價 |

#### 震撼對照（3–5 個，依金額篩選）
- `= X 台 MacBook Pro M5`（以 NT$75,000 為基準）
- `= 台北一房 X 個月租金`（以 NT$25,000/月）
- `= 環島 X 次`（以 NT$50,000/次）
- `= X 張台積電（1 張 NT$115,000）`
- `= Rolex Submariner X 支`（以 NT$350,000，金額 > 35 萬才顯示）

#### 收據 Footer（幽默固定文案）
```
感謝您對 Apple 的無私奉獻
Tim Cook 已收到您的愛心
本收據僅供娛樂參考，不具法律效力
```

---

### Step 4：分享機制

**分享卡片規格**：1080×1080 PNG（Threads / IG / LINE 通用）

**卡片內容**：
```
上方大字：我的 Apple 稅
NT$ 480,730
中間：等級 badge（★ 蘋果信徒 ★）
下方：最貴品項 emoji icon
右下角浮水印：apptax.tw（或最終 domain）
```

**技術**：Satori（Vercel OG Image）→ React JSX → PNG
- 優先 Satori：無頭、快速、Vercel 免費方案夠用
- Fallback：`html-to-image`（純 client-side）

**分享按鈕清單**：
1. 下載圖片（主要 CTA，藍色）
2. 分享到 Threads
3. 分享到 X / Twitter
4. 複製純文字（給 LINE / Telegram）
5. 複製連結（帶查詢參數，讓朋友看到你的結果）

**預設分享文案**：
```
我這輩子貢獻 Apple 了 NT$480,730 😱
等級：★ 蘋果信徒 ★
你呢？→ [網址]
#Apple稅 #蘋果信徒
```

---

## 技術棧

| 層 | 工具 | 原因 |
|---|---|---|
| 框架 | Next.js 15（App Router） | SEO 友善、Vercel 原生 |
| 樣式 | Tailwind CSS | 快速、收據排版用 utility class |
| 動畫 | `framer-motion` + `react-countup` | count-up + 區塊淡入 |
| 分享圖 | `satori` | Vercel 出品、JSX → PNG |
| 狀態 | React `useState` | 不需要 Redux，選擇狀態很簡單 |
| 部署 | Vercel（免費方案） | GitHub 連動、CDN、Satori 支援 |
| 分析 | Vercel Analytics + GA4 | 雙保險 |
| 字體 | System font stack | 不用 host，iOS/macOS 自動 SF Pro |

**資料**：全部寫死 JSON 放 `/data/`，直接 import，零 API 成本

---

## 資料 JSON 結構

### `/data/products.json`
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
    }
  ],
  "mac": [...],
  "ipad": [...],
  "wearable": [...],
  "subscription": [...]
}
```

### `/data/aapl-history.json`
```json
{
  "AAPL_historical": [
    { "year": 2014, "close_usd": 27.59 },
    { "year": 2015, "close_usd": 26.32 },
    { "year": 2025, "close_usd": 250.00 }
  ],
  "usd_twd_rate": 31
}
```

### `/data/comparisons.json`
```json
{
  "comparisons": [
    { "name": "MacBook Pro M5", "price_twd": 75000, "emoji": "💻", "trigger_min": 50000 },
    { "name": "台北一房月租", "price_twd": 25000, "emoji": "🏠", "unit": "個月", "trigger_min": 100000 },
    { "name": "環島一次", "price_twd": 50000, "emoji": "🏝️", "trigger_min": 30000 },
    { "name": "Rolex Submariner", "price_twd": 350000, "emoji": "⌚", "trigger_min": 300000 },
    { "name": "台積電（1 張）", "price_twd": 115000, "emoji": "📈", "trigger_min": 100000 }
  ]
}
```

---

## 變現埋點

**原則**：一個頁面最多 2 個貨幣化元素，保持乾淨。

### 信用卡 Affiliate（結果頁底部）
```
💳 下次買蘋果，用這張卡能省更多
→ 國泰世華 CUBE 卡｜蘋果官網 3% 回饋   [申辦]
→ 台新 @Gogo 卡｜3C 最高 5% 回饋       [申辦]
```
Affiliate 連結上線前確認可用性（市場狀況會變動）。  
揭露文字：「本站含 affiliate 連結，點擊不影響你的費用」

### Google AdSense（1 個位置）
- 位置：結果頁收據下方、分享按鈕上方
- 只放 1 個，不讓廣告影響視覺主體

---

## 上線前 Checklist

### 資料
- [ ] iPhone 6 → iPhone 17 Pro Max 台幣售價（含各容量）
- [ ] Mac 2014 → 2025 主要型號台幣售價
- [ ] iPad 2014 → 2025 主要型號台幣售價
- [ ] AirPods / Apple Watch / HomePod 歷代台幣售價
- [ ] 訂閱服務歷年月費
- [ ] AAPL 年度調整後收盤價（2014–2025）
- [ ] 對照物基準金額（至少 8 個）

### 功能
- [ ] 選擇流程：多選、容量選擇、跳過分類
- [ ] 實時合計顯示
- [ ] 收據 count-up 動畫
- [ ] AAPL 股票計算正確
- [ ] 等級 badge 判斷正確
- [ ] 對照物依金額篩選正確
- [ ] 分享圖生成（Satori）
- [ ] 所有分享按鈕可用

### 技術
- [ ] Lighthouse > 90（Performance + SEO）
- [ ] 手機版無破版（320px–430px 主要測試）
- [ ] OG 圖正確（FB / LINE 預覽）
- [ ] Meta title / description 設定
- [ ] GA4 事件追蹤（分享、結果頁到達）
- [ ] Vercel Analytics 開啟

### 法務
- [ ] Privacy Policy 頁（純前端也要有）
- [ ] 免責聲明：「本站計算結果僅供娛樂參考」
- [ ] Affiliate 揭露文字

---

## 推廣計畫（上線第 1 週）

**Day 1**
- 自己先算，截圖發 Threads 個人帳號
- 發 Dcard 3C 板 / Apple 板
- 發 PTT Mac 板 / iOS 板

**Day 2–3**
- DM 台灣蘋果主題 YouTuber（小宇宙 Tech、Tim 哥、蘋果好朋友）
- 提供素材，不求報酬，只求曝光

**第 14 天檢視**
- 日均 UV > 1,000 → 買獨立 domain（`apptax.tw` 或 `howmuchapple.com`）
- 日均 UV 100–500 → 繼續 SEO，做第 2 個作品
- 日均 UV < 100 → 寫一篇「我做了 XX 沒紅」文章（本身可能會紅）

---

## 架構決策（plan-eng-review 後確認）

| 決策 | 選擇 | 原因 |
|---|---|---|
| 分享連結內容 | 只帶 `?total=480730&grade=believer` | 病毒循環是帶別人來算自己，不需要帶完整選擇 |
| Share card（PNG）內容 | 只有總金額 + 等級 badge | 簡潔，震撼力強，Satori 實作最簡單 |
| USD/TWD 換算 | 固定 31，加免責聲明 | 娛樂用途，精確度不需會計等級 |
| 動畫 | CSS transitions + react-countup | 省去 framer-motion 60KB |
| 計算按鈕 | disabled 直到選至少 1 項 | 防止空收據 |
| 快選 chips | 每個 tab 頂部 2-3 個最常見機型 | 降低棄用率 |
| AdSense | Day 4 留 slot 佔位，提早申請審核 | AdSense 新域名審核需 1-3 週 |
| Satori 注意 | Share card 需獨立 JSX + inline styles | Satori 不支援 Tailwind class |

## 靠北對照物清單（更新版）

| 對照物 | 基準金額 | trigger_min |
|---|---|---|
| MacBook Pro M5 | NT$75,000 | NT$50,000 |
| 日本旅遊一次 | NT$45,000 | NT$30,000 |
| iPhone 17 Pro Max | NT$45,900 | NT$30,000 |
| 台北一房月租 | NT$25,000 | NT$100,000 |
| Tim Cook X 分鐘薪水 | NT$1,141/分 | NT$50,000 |
| 星巴克拿鐵 | NT$165/杯 | NT$10,000 |
| X 年的超商雞排 | NT$18,250/年（50元×365） | NT$10,000 |
| 台積電 1 張 | NT$115,000 | NT$115,000 |

（移除：Rolex Submariner、環島）

## 快選 Chips 建議內容

**iPhone tab：** iPhone 15 Pro Max / iPhone 13 / iPhone SE (3代)  
**Mac+iPad tab：** MacBook Air M3 / iPad Pro 13吋 / 無  
**穿戴 tab：** AirPods Pro (2代) / Apple Watch Series 10 / 無  
**訂閱 tab：** iCloud+ 200GB (3年) / Apple Music (2年) / 無

## 參考視覺

- 線框稿：`/tmp/gstack-sketch-iphone-cost.html`（Variant B，白底 + Apple 藍色點綴）
- 收據關鍵 CSS：
  - 鋸齒：`radial-gradient(circle at 50% 0%, #f5f5f7 6px, #fff 6px)`
  - 條碼：`repeating-linear-gradient(90deg, #1d1d1f 0px, #1d1d1f 2px, transparent 2px, transparent 6px)`
  - 陰影：`box-shadow: 0 4px 20px rgba(0,0,0,0.08)`
