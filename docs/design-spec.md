# 花蘋果 — 設計規格

## 品牌名稱
**花蘋果**
- 花 = 花錢（動詞）
- 蘋果 = Apple
- 副標：你花了多少在蘋果上？

## 配色

| 用途 | 色碼 | 說明 |
|------|------|------|
| 背景 | `#1C1C1E` | Apple dark（iOS 系統背景） |
| 卡片/紙 | `#FFFFFF` | 收據紙白 |
| 強調色 | `#FF9F0A` | 琥珀金（iOS 深色模式 orange） |
| 主要文字 | `#FFFFFF` | 白字 |
| 次要文字 | `#AEAEB2` | iOS tertiary label |
| 靜音文字 | `#636366` | iOS quaternary label |
| 分隔線 | `#2C2C2E` | iOS separator dark |

## 字型
- 中文：PingFang TC（iOS/macOS 內建，WebFont 用 system-ui + 'PingFang TC'）
- 英文/數字：-apple-system / SF Pro（系統字）
- 不需外部字型載入，全用 system font stack

## Logo mark
**概念：** 收據 + 蘋果咬一口
- 白色收據紙形狀（圓角矩形）
- 右上角被「蘋果咬一口」（橢圓形 cutout + 小葉子）
- 底部鋸齒邊（撕收據的質感）
- 底部金色條：總金額欄位暗示

**尺寸適用：**
- 120×120 → app icon、社群頭像
- 32×32 → favicon（簡化版，移除文字細節）
- 16×16 → browser tab favicon（只保留剪影）

## OG 圖片規格
- 尺寸：1200×630（標準 og:image）
- 另做：1080×1080（方形，供 IG / LINE 分享）
- 靜態預設版：`og-default.svg` → 轉 PNG
- 動態版（Satori）：`/api/og?total=480730&grade=believer`

### 動態 OG 版面配置
```
┌─────────────────────────────────────────┐
│ [logo]  花蘋果              [收據插圖]   │
│                                          │
│   NT$480,730                             │
│   總花費                                 │
│                                          │
│   🏆 蘋果深度使用者                      │
│   「很認真」                             │
│                                          │
│   如果買 AAPL：+NT$1,230,000            │
└─────────────────────────────────────────┘
```

## 設計原則
1. **Apple 美學但不抄**：用 Apple 的配色系統和字型邏輯，但不用 Apple logo（商標問題）
2. **收據是核心視覺語言**：鋸齒邊、條狀佈局、monospace 數字
3. **黑底金字**：有「帳單」感，也有奢華感，兩者都符合主題
4. **數字要大**：結果頁的金額是視覺焦點，字要夠大才能截圖分享

## 檔案清單
- `doc/logo.svg` — 完整 logo mark（120×120）
- `doc/og-default.svg` — 預設 OG 圖（1200×630），轉 PNG 用
- `public/favicon.svg` — 簡化版 favicon（從 logo.svg 精簡）
- `public/og-default.png` — 從 og-default.svg 輸出
