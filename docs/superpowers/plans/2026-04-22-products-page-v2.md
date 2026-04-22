# Products Page v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 全面升級選商品頁：補齊所有 Apple 歷史產品、折疊式卡片、數量選擇、訂閱自訂月份、產品圖片。

**Architecture:** 資料層擴充 products.json（完整歷史）+ 下載產品圖到 public/；Selection 型別加 quantity；ProductCard 改為 accordion + quantity counter；訂閱卡獨立 UI 支援自訂月數。

**Tech Stack:** React Router v7, Tailwind CSS v4, TypeScript, Node.js scripts (圖片下載)

---

## 檔案對照表

| 動作 | 路徑 |
|---|---|
| Modify | `data/products.json` — 補齊所有產品 |
| Create | `scripts/download-product-images.mjs` — 批次下載 Apple CDN 圖片 |
| Modify | `app/lib/types.ts` — Selection 加 quantity，ProductVariant 加 monthly_price_twd |
| Modify | `app/lib/calculations.ts` — calcTotal 乘以 quantity |
| Modify | `app/lib/calculations.test.ts` — 更新測試 |
| Modify | `app/components/ProductCard.tsx` — 折疊式 + quantity counter |
| Create | `app/components/SubscriptionCard.tsx` — 訂閱自訂月份卡片 |
| Modify | `app/components/ProductTabs.tsx` — 移除快選區、加圖片、用 SubscriptionCard |
| Modify | `app/routes/products.tsx` — 更新 handleToggle 支援 quantity |

---

## Task A：更新 `data/products.json` — 完整產品資料

**Files:**
- Modify: `data/products.json`

### iPhone 完整清單（台灣上市售價，新到舊）

- [ ] **Step 1：寫入 iPhone 資料（2025–2007）**

```json
{
  "iphone": [
    { "id": "iphone-17-pro-max", "model": "iPhone 17 Pro Max", "year": 2025, "variants": [
      { "storage": "256GB", "price_twd": 49900 },
      { "storage": "512GB", "price_twd": 56900 },
      { "storage": "1TB", "price_twd": 63900 }
    ]},
    { "id": "iphone-17-pro", "model": "iPhone 17 Pro", "year": 2025, "variants": [
      { "storage": "128GB", "price_twd": 42900 },
      { "storage": "256GB", "price_twd": 45900 },
      { "storage": "512GB", "price_twd": 52900 },
      { "storage": "1TB", "price_twd": 59900 }
    ]},
    { "id": "iphone-17-plus", "model": "iPhone 17 Plus", "year": 2025, "variants": [
      { "storage": "128GB", "price_twd": 36900 },
      { "storage": "256GB", "price_twd": 39900 },
      { "storage": "512GB", "price_twd": 46900 }
    ]},
    { "id": "iphone-17", "model": "iPhone 17", "year": 2025, "variants": [
      { "storage": "128GB", "price_twd": 32900 },
      { "storage": "256GB", "price_twd": 35900 },
      { "storage": "512GB", "price_twd": 42900 }
    ]},
    { "id": "iphone-16e", "model": "iPhone 16e", "year": 2025, "variants": [
      { "storage": "128GB", "price_twd": 24900 },
      { "storage": "256GB", "price_twd": 27900 },
      { "storage": "512GB", "price_twd": 34900 }
    ]},
    { "id": "iphone-16-pro-max", "model": "iPhone 16 Pro Max", "year": 2024, "variants": [
      { "storage": "256GB", "price_twd": 46900 },
      { "storage": "512GB", "price_twd": 53900 },
      { "storage": "1TB", "price_twd": 60900 }
    ]},
    { "id": "iphone-16-pro", "model": "iPhone 16 Pro", "year": 2024, "variants": [
      { "storage": "128GB", "price_twd": 39900 },
      { "storage": "256GB", "price_twd": 42900 },
      { "storage": "512GB", "price_twd": 49900 },
      { "storage": "1TB", "price_twd": 56900 }
    ]},
    { "id": "iphone-16-plus", "model": "iPhone 16 Plus", "year": 2024, "variants": [
      { "storage": "128GB", "price_twd": 34900 },
      { "storage": "256GB", "price_twd": 37900 },
      { "storage": "512GB", "price_twd": 44900 }
    ]},
    { "id": "iphone-16", "model": "iPhone 16", "year": 2024, "variants": [
      { "storage": "128GB", "price_twd": 29900 },
      { "storage": "256GB", "price_twd": 32900 },
      { "storage": "512GB", "price_twd": 39900 }
    ]},
    { "id": "iphone-15-pro-max", "model": "iPhone 15 Pro Max", "year": 2023, "variants": [
      { "storage": "256GB", "price_twd": 49900 },
      { "storage": "512GB", "price_twd": 56900 },
      { "storage": "1TB", "price_twd": 63900 }
    ]},
    { "id": "iphone-15-pro", "model": "iPhone 15 Pro", "year": 2023, "variants": [
      { "storage": "128GB", "price_twd": 40900 },
      { "storage": "256GB", "price_twd": 43900 },
      { "storage": "512GB", "price_twd": 50900 },
      { "storage": "1TB", "price_twd": 57900 }
    ]},
    { "id": "iphone-15-plus", "model": "iPhone 15 Plus", "year": 2023, "variants": [
      { "storage": "128GB", "price_twd": 34900 },
      { "storage": "256GB", "price_twd": 37900 },
      { "storage": "512GB", "price_twd": 44900 }
    ]},
    { "id": "iphone-15", "model": "iPhone 15", "year": 2023, "variants": [
      { "storage": "128GB", "price_twd": 29900 },
      { "storage": "256GB", "price_twd": 32900 },
      { "storage": "512GB", "price_twd": 39900 }
    ]},
    { "id": "iphone-14-pro-max", "model": "iPhone 14 Pro Max", "year": 2022, "variants": [
      { "storage": "128GB", "price_twd": 46900 },
      { "storage": "256GB", "price_twd": 49900 },
      { "storage": "512GB", "price_twd": 56900 },
      { "storage": "1TB", "price_twd": 63900 }
    ]},
    { "id": "iphone-14-pro", "model": "iPhone 14 Pro", "year": 2022, "variants": [
      { "storage": "128GB", "price_twd": 40900 },
      { "storage": "256GB", "price_twd": 43900 },
      { "storage": "512GB", "price_twd": 50900 },
      { "storage": "1TB", "price_twd": 57900 }
    ]},
    { "id": "iphone-14-plus", "model": "iPhone 14 Plus", "year": 2022, "variants": [
      { "storage": "128GB", "price_twd": 34900 },
      { "storage": "256GB", "price_twd": 37900 },
      { "storage": "512GB", "price_twd": 44900 }
    ]},
    { "id": "iphone-14", "model": "iPhone 14", "year": 2022, "variants": [
      { "storage": "128GB", "price_twd": 29900 },
      { "storage": "256GB", "price_twd": 32900 },
      { "storage": "512GB", "price_twd": 39900 }
    ]},
    { "id": "iphone-se-3", "model": "iPhone SE 3", "year": 2022, "variants": [
      { "storage": "64GB", "price_twd": 14900 },
      { "storage": "128GB", "price_twd": 16900 },
      { "storage": "256GB", "price_twd": 20900 }
    ]},
    { "id": "iphone-13-pro-max", "model": "iPhone 13 Pro Max", "year": 2021, "variants": [
      { "storage": "128GB", "price_twd": 40900 },
      { "storage": "256GB", "price_twd": 43900 },
      { "storage": "512GB", "price_twd": 50900 },
      { "storage": "1TB", "price_twd": 57900 }
    ]},
    { "id": "iphone-13-pro", "model": "iPhone 13 Pro", "year": 2021, "variants": [
      { "storage": "128GB", "price_twd": 34900 },
      { "storage": "256GB", "price_twd": 37900 },
      { "storage": "512GB", "price_twd": 44900 },
      { "storage": "1TB", "price_twd": 51900 }
    ]},
    { "id": "iphone-13-mini", "model": "iPhone 13 mini", "year": 2021, "variants": [
      { "storage": "128GB", "price_twd": 25900 },
      { "storage": "256GB", "price_twd": 28900 },
      { "storage": "512GB", "price_twd": 35900 }
    ]},
    { "id": "iphone-13", "model": "iPhone 13", "year": 2021, "variants": [
      { "storage": "128GB", "price_twd": 29900 },
      { "storage": "256GB", "price_twd": 32900 },
      { "storage": "512GB", "price_twd": 39900 }
    ]},
    { "id": "iphone-12-pro-max", "model": "iPhone 12 Pro Max", "year": 2020, "variants": [
      { "storage": "128GB", "price_twd": 40900 },
      { "storage": "256GB", "price_twd": 43900 },
      { "storage": "512GB", "price_twd": 50900 }
    ]},
    { "id": "iphone-12-pro", "model": "iPhone 12 Pro", "year": 2020, "variants": [
      { "storage": "128GB", "price_twd": 34900 },
      { "storage": "256GB", "price_twd": 37900 },
      { "storage": "512GB", "price_twd": 44900 }
    ]},
    { "id": "iphone-12-mini", "model": "iPhone 12 mini", "year": 2020, "variants": [
      { "storage": "64GB", "price_twd": 22900 },
      { "storage": "128GB", "price_twd": 24900 },
      { "storage": "256GB", "price_twd": 28900 }
    ]},
    { "id": "iphone-12", "model": "iPhone 12", "year": 2020, "variants": [
      { "storage": "64GB", "price_twd": 26900 },
      { "storage": "128GB", "price_twd": 28900 },
      { "storage": "256GB", "price_twd": 32900 }
    ]},
    { "id": "iphone-se-2", "model": "iPhone SE 2", "year": 2020, "variants": [
      { "storage": "64GB", "price_twd": 14500 },
      { "storage": "128GB", "price_twd": 16500 },
      { "storage": "256GB", "price_twd": 20500 }
    ]},
    { "id": "iphone-11-pro-max", "model": "iPhone 11 Pro Max", "year": 2019, "variants": [
      { "storage": "64GB", "price_twd": 39900 },
      { "storage": "256GB", "price_twd": 44900 },
      { "storage": "512GB", "price_twd": 51900 }
    ]},
    { "id": "iphone-11-pro", "model": "iPhone 11 Pro", "year": 2019, "variants": [
      { "storage": "64GB", "price_twd": 33900 },
      { "storage": "256GB", "price_twd": 38900 },
      { "storage": "512GB", "price_twd": 45900 }
    ]},
    { "id": "iphone-11", "model": "iPhone 11", "year": 2019, "variants": [
      { "storage": "64GB", "price_twd": 24900 },
      { "storage": "128GB", "price_twd": 26900 },
      { "storage": "256GB", "price_twd": 30900 }
    ]},
    { "id": "iphone-xs-max", "model": "iPhone XS Max", "year": 2018, "variants": [
      { "storage": "64GB", "price_twd": 38900 },
      { "storage": "256GB", "price_twd": 44900 },
      { "storage": "512GB", "price_twd": 51900 }
    ]},
    { "id": "iphone-xs", "model": "iPhone XS", "year": 2018, "variants": [
      { "storage": "64GB", "price_twd": 33900 },
      { "storage": "256GB", "price_twd": 38900 },
      { "storage": "512GB", "price_twd": 45900 }
    ]},
    { "id": "iphone-xr", "model": "iPhone XR", "year": 2018, "variants": [
      { "storage": "64GB", "price_twd": 24900 },
      { "storage": "128GB", "price_twd": 26900 },
      { "storage": "256GB", "price_twd": 30900 }
    ]},
    { "id": "iphone-x", "model": "iPhone X", "year": 2017, "variants": [
      { "storage": "64GB", "price_twd": 35900 },
      { "storage": "256GB", "price_twd": 40900 }
    ]},
    { "id": "iphone-8-plus", "model": "iPhone 8 Plus", "year": 2017, "variants": [
      { "storage": "64GB", "price_twd": 27900 },
      { "storage": "256GB", "price_twd": 32900 }
    ]},
    { "id": "iphone-8", "model": "iPhone 8", "year": 2017, "variants": [
      { "storage": "64GB", "price_twd": 22900 },
      { "storage": "256GB", "price_twd": 27900 }
    ]},
    { "id": "iphone-7-plus", "model": "iPhone 7 Plus", "year": 2016, "variants": [
      { "storage": "32GB", "price_twd": 27900 },
      { "storage": "128GB", "price_twd": 31900 },
      { "storage": "256GB", "price_twd": 35900 }
    ]},
    { "id": "iphone-7", "model": "iPhone 7", "year": 2016, "variants": [
      { "storage": "32GB", "price_twd": 21900 },
      { "storage": "128GB", "price_twd": 25900 },
      { "storage": "256GB", "price_twd": 29900 }
    ]},
    { "id": "iphone-se-1", "model": "iPhone SE 1", "year": 2016, "variants": [
      { "storage": "16GB", "price_twd": 12900 },
      { "storage": "64GB", "price_twd": 15900 }
    ]},
    { "id": "iphone-6s-plus", "model": "iPhone 6s Plus", "year": 2015, "variants": [
      { "storage": "16GB", "price_twd": 28900 },
      { "storage": "64GB", "price_twd": 32900 },
      { "storage": "128GB", "price_twd": 36900 }
    ]},
    { "id": "iphone-6s", "model": "iPhone 6s", "year": 2015, "variants": [
      { "storage": "16GB", "price_twd": 23900 },
      { "storage": "64GB", "price_twd": 27900 },
      { "storage": "128GB", "price_twd": 31900 }
    ]},
    { "id": "iphone-6-plus", "model": "iPhone 6 Plus", "year": 2014, "variants": [
      { "storage": "16GB", "price_twd": 26900 },
      { "storage": "64GB", "price_twd": 30900 },
      { "storage": "128GB", "price_twd": 34900 }
    ]},
    { "id": "iphone-6", "model": "iPhone 6", "year": 2014, "variants": [
      { "storage": "16GB", "price_twd": 21900 },
      { "storage": "64GB", "price_twd": 25900 },
      { "storage": "128GB", "price_twd": 29900 }
    ]},
    { "id": "iphone-5s", "model": "iPhone 5s", "year": 2013, "variants": [
      { "storage": "16GB", "price_twd": 21900 },
      { "storage": "32GB", "price_twd": 24900 },
      { "storage": "64GB", "price_twd": 27900 }
    ]},
    { "id": "iphone-5c", "model": "iPhone 5c", "year": 2013, "variants": [
      { "storage": "16GB", "price_twd": 17900 },
      { "storage": "32GB", "price_twd": 20900 }
    ]},
    { "id": "iphone-5", "model": "iPhone 5", "year": 2012, "variants": [
      { "storage": "16GB", "price_twd": 21900 },
      { "storage": "32GB", "price_twd": 24900 },
      { "storage": "64GB", "price_twd": 27900 }
    ]},
    { "id": "iphone-4s", "model": "iPhone 4S", "year": 2011, "variants": [
      { "storage": "16GB", "price_twd": 18900 },
      { "storage": "32GB", "price_twd": 21900 },
      { "storage": "64GB", "price_twd": 24900 }
    ]},
    { "id": "iphone-4", "model": "iPhone 4", "year": 2010, "variants": [
      { "storage": "16GB", "price_twd": 18900 },
      { "storage": "32GB", "price_twd": 21900 }
    ]},
    { "id": "iphone-3gs", "model": "iPhone 3GS", "year": 2009, "variants": [
      { "storage": "16GB", "price_twd": 16900 },
      { "storage": "32GB", "price_twd": 19900 }
    ]},
    { "id": "iphone-3g", "model": "iPhone 3G", "year": 2008, "variants": [
      { "storage": "8GB", "price_twd": 15900 },
      { "storage": "16GB", "price_twd": 18900 }
    ]},
    { "id": "iphone-1", "model": "iPhone 1", "year": 2007, "variants": [
      { "storage": "4GB", "price_twd": 14900 },
      { "storage": "8GB", "price_twd": 17900 }
    ]}
  ]
}
```

- [ ] **Step 2：寫入 Mac 資料（2025–2018）**

```json
"mac": [
  { "id": "mac-studio-m4-ultra", "model": "Mac Studio M4 Ultra", "year": 2025, "variants": [
    { "storage": "512GB", "price_twd": 149900 },
    { "storage": "1TB", "price_twd": 164900 }
  ]},
  { "id": "mac-studio-m4-max", "model": "Mac Studio M4 Max", "year": 2025, "variants": [
    { "storage": "512GB", "price_twd": 79900 },
    { "storage": "1TB", "price_twd": 94900 }
  ]},
  { "id": "macbook-air-15-m4", "model": "MacBook Air 15\" M4", "year": 2025, "variants": [
    { "storage": "256GB", "price_twd": 41900 },
    { "storage": "512GB", "price_twd": 49900 },
    { "storage": "1TB", "price_twd": 59900 }
  ]},
  { "id": "macbook-air-13-m4", "model": "MacBook Air 13\" M4", "year": 2025, "variants": [
    { "storage": "256GB", "price_twd": 34900 },
    { "storage": "512GB", "price_twd": 42900 },
    { "storage": "1TB", "price_twd": 52900 }
  ]},
  { "id": "macbook-pro-16-m4-max", "model": "MacBook Pro 16\" M4 Max", "year": 2024, "variants": [
    { "storage": "512GB", "price_twd": 119900 },
    { "storage": "1TB", "price_twd": 134900 }
  ]},
  { "id": "macbook-pro-16-m4-pro", "model": "MacBook Pro 16\" M4 Pro", "year": 2024, "variants": [
    { "storage": "512GB", "price_twd": 84900 },
    { "storage": "1TB", "price_twd": 97900 }
  ]},
  { "id": "macbook-pro-14-m4-max", "model": "MacBook Pro 14\" M4 Max", "year": 2024, "variants": [
    { "storage": "512GB", "price_twd": 109900 },
    { "storage": "1TB", "price_twd": 124900 }
  ]},
  { "id": "macbook-pro-14-m4-pro", "model": "MacBook Pro 14\" M4 Pro", "year": 2024, "variants": [
    { "storage": "512GB", "price_twd": 74900 },
    { "storage": "1TB", "price_twd": 87900 }
  ]},
  { "id": "macbook-pro-14-m4", "model": "MacBook Pro 14\" M4", "year": 2024, "variants": [
    { "storage": "512GB", "price_twd": 59900 },
    { "storage": "1TB", "price_twd": 69900 }
  ]},
  { "id": "imac-m4", "model": "iMac M4", "year": 2024, "variants": [
    { "storage": "256GB", "price_twd": 46900 },
    { "storage": "512GB", "price_twd": 54900 },
    { "storage": "1TB", "price_twd": 64900 }
  ]},
  { "id": "mac-mini-m4-pro", "model": "Mac mini M4 Pro", "year": 2024, "variants": [
    { "storage": "512GB", "price_twd": 42900 },
    { "storage": "1TB", "price_twd": 54900 }
  ]},
  { "id": "mac-mini-m4", "model": "Mac mini M4", "year": 2024, "variants": [
    { "storage": "256GB", "price_twd": 21900 },
    { "storage": "512GB", "price_twd": 27900 }
  ]},
  { "id": "mac-pro-m2-ultra", "model": "Mac Pro M2 Ultra", "year": 2023, "variants": [
    { "storage": "1TB", "price_twd": 239900 },
    { "storage": "2TB", "price_twd": 269900 }
  ]},
  { "id": "mac-studio-m2-ultra", "model": "Mac Studio M2 Ultra", "year": 2023, "variants": [
    { "storage": "1TB", "price_twd": 129900 },
    { "storage": "2TB", "price_twd": 154900 }
  ]},
  { "id": "mac-studio-m2-max", "model": "Mac Studio M2 Max", "year": 2023, "variants": [
    { "storage": "512GB", "price_twd": 69900 },
    { "storage": "1TB", "price_twd": 84900 }
  ]},
  { "id": "macbook-pro-16-m3-max", "model": "MacBook Pro 16\" M3 Max", "year": 2023, "variants": [
    { "storage": "512GB", "price_twd": 109900 },
    { "storage": "1TB", "price_twd": 124900 }
  ]},
  { "id": "macbook-pro-16-m3-pro", "model": "MacBook Pro 16\" M3 Pro", "year": 2023, "variants": [
    { "storage": "512GB", "price_twd": 79900 },
    { "storage": "1TB", "price_twd": 92900 }
  ]},
  { "id": "macbook-pro-14-m3-max", "model": "MacBook Pro 14\" M3 Max", "year": 2023, "variants": [
    { "storage": "512GB", "price_twd": 99900 },
    { "storage": "1TB", "price_twd": 114900 }
  ]},
  { "id": "macbook-pro-14-m3-pro", "model": "MacBook Pro 14\" M3 Pro", "year": 2023, "variants": [
    { "storage": "512GB", "price_twd": 69900 },
    { "storage": "1TB", "price_twd": 82900 }
  ]},
  { "id": "macbook-pro-14-m3", "model": "MacBook Pro 14\" M3", "year": 2023, "variants": [
    { "storage": "512GB", "price_twd": 54900 },
    { "storage": "1TB", "price_twd": 64900 }
  ]},
  { "id": "imac-m3", "model": "iMac M3", "year": 2023, "variants": [
    { "storage": "256GB", "price_twd": 44900 },
    { "storage": "512GB", "price_twd": 52900 },
    { "storage": "1TB", "price_twd": 62900 }
  ]},
  { "id": "macbook-air-15-m2", "model": "MacBook Air 15\" M2", "year": 2023, "variants": [
    { "storage": "256GB", "price_twd": 39900 },
    { "storage": "512GB", "price_twd": 47900 }
  ]},
  { "id": "mac-mini-m2-pro", "model": "Mac mini M2 Pro", "year": 2023, "variants": [
    { "storage": "512GB", "price_twd": 37900 },
    { "storage": "1TB", "price_twd": 47900 }
  ]},
  { "id": "mac-mini-m2", "model": "Mac mini M2", "year": 2023, "variants": [
    { "storage": "256GB", "price_twd": 18900 },
    { "storage": "512GB", "price_twd": 24900 }
  ]},
  { "id": "macbook-air-13-m2", "model": "MacBook Air 13\" M2", "year": 2022, "variants": [
    { "storage": "256GB", "price_twd": 35900 },
    { "storage": "512GB", "price_twd": 43900 },
    { "storage": "1TB", "price_twd": 53900 }
  ]},
  { "id": "macbook-pro-16-m2-max", "model": "MacBook Pro 16\" M2 Max", "year": 2023, "variants": [
    { "storage": "512GB", "price_twd": 104900 },
    { "storage": "1TB", "price_twd": 119900 }
  ]},
  { "id": "macbook-pro-14-m2-pro", "model": "MacBook Pro 14\" M2 Pro", "year": 2023, "variants": [
    { "storage": "512GB", "price_twd": 64900 },
    { "storage": "1TB", "price_twd": 77900 }
  ]},
  { "id": "macbook-air-13-m1", "model": "MacBook Air 13\" M1", "year": 2020, "variants": [
    { "storage": "256GB", "price_twd": 29900 },
    { "storage": "512GB", "price_twd": 37900 }
  ]},
  { "id": "macbook-pro-13-m1", "model": "MacBook Pro 13\" M1", "year": 2020, "variants": [
    { "storage": "256GB", "price_twd": 36900 },
    { "storage": "512GB", "price_twd": 44900 }
  ]},
  { "id": "mac-mini-m1", "model": "Mac mini M1", "year": 2020, "variants": [
    { "storage": "256GB", "price_twd": 18900 },
    { "storage": "512GB", "price_twd": 24900 }
  ]}
]
```

- [ ] **Step 3：寫入 iPad 資料**

```json
"ipad": [
  { "id": "ipad-air-13-m3", "model": "iPad Air 13\" M3", "year": 2025, "variants": [
    { "storage": "128GB", "price_twd": 26900 },
    { "storage": "256GB", "price_twd": 29900 },
    { "storage": "512GB", "price_twd": 35900 },
    { "storage": "1TB", "price_twd": 41900 }
  ]},
  { "id": "ipad-air-11-m3", "model": "iPad Air 11\" M3", "year": 2025, "variants": [
    { "storage": "128GB", "price_twd": 19900 },
    { "storage": "256GB", "price_twd": 22900 },
    { "storage": "512GB", "price_twd": 28900 },
    { "storage": "1TB", "price_twd": 34900 }
  ]},
  { "id": "ipad-pro-13-m4", "model": "iPad Pro 13\" M4", "year": 2024, "variants": [
    { "storage": "256GB", "price_twd": 39900 },
    { "storage": "512GB", "price_twd": 46900 },
    { "storage": "1TB", "price_twd": 59900 },
    { "storage": "2TB", "price_twd": 72900 }
  ]},
  { "id": "ipad-pro-11-m4", "model": "iPad Pro 11\" M4", "year": 2024, "variants": [
    { "storage": "256GB", "price_twd": 29900 },
    { "storage": "512GB", "price_twd": 36900 },
    { "storage": "1TB", "price_twd": 49900 },
    { "storage": "2TB", "price_twd": 62900 }
  ]},
  { "id": "ipad-mini-7", "model": "iPad mini 7", "year": 2024, "variants": [
    { "storage": "128GB", "price_twd": 16900 },
    { "storage": "256GB", "price_twd": 19900 },
    { "storage": "512GB", "price_twd": 25900 }
  ]},
  { "id": "ipad-10", "model": "iPad 10", "year": 2022, "variants": [
    { "storage": "64GB", "price_twd": 12900 },
    { "storage": "256GB", "price_twd": 17900 }
  ]},
  { "id": "ipad-air-13-m2", "model": "iPad Air 13\" M2", "year": 2024, "variants": [
    { "storage": "128GB", "price_twd": 24900 },
    { "storage": "256GB", "price_twd": 27900 },
    { "storage": "512GB", "price_twd": 33900 },
    { "storage": "1TB", "price_twd": 39900 }
  ]},
  { "id": "ipad-air-11-m2", "model": "iPad Air 11\" M2", "year": 2024, "variants": [
    { "storage": "128GB", "price_twd": 18900 },
    { "storage": "256GB", "price_twd": 21900 },
    { "storage": "512GB", "price_twd": 27900 },
    { "storage": "1TB", "price_twd": 33900 }
  ]},
  { "id": "ipad-pro-12-m2", "model": "iPad Pro 12.9\" M2", "year": 2022, "variants": [
    { "storage": "128GB", "price_twd": 32900 },
    { "storage": "256GB", "price_twd": 36900 },
    { "storage": "512GB", "price_twd": 44900 },
    { "storage": "1TB", "price_twd": 56900 },
    { "storage": "2TB", "price_twd": 68900 }
  ]},
  { "id": "ipad-pro-11-m2", "model": "iPad Pro 11\" M2", "year": 2022, "variants": [
    { "storage": "128GB", "price_twd": 24900 },
    { "storage": "256GB", "price_twd": 28900 },
    { "storage": "512GB", "price_twd": 36900 },
    { "storage": "1TB", "price_twd": 48900 },
    { "storage": "2TB", "price_twd": 60900 }
  ]},
  { "id": "ipad-mini-6", "model": "iPad mini 6", "year": 2021, "variants": [
    { "storage": "64GB", "price_twd": 14900 },
    { "storage": "256GB", "price_twd": 19900 }
  ]},
  { "id": "ipad-9", "model": "iPad 9", "year": 2021, "variants": [
    { "storage": "64GB", "price_twd": 10900 },
    { "storage": "256GB", "price_twd": 15900 }
  ]}
]
```

- [ ] **Step 4：寫入穿戴裝置資料**

```json
"wearable": [
  { "id": "vision-pro", "model": "Apple Vision Pro", "year": 2024, "variants": [
    { "storage": "256GB", "price_twd": 112900 },
    { "storage": "512GB", "price_twd": 119900 },
    { "storage": "1TB", "price_twd": 129900 }
  ]},
  { "id": "apple-watch-ultra-2", "model": "Apple Watch Ultra 2", "year": 2024, "variants": [
    { "storage": "一般版", "price_twd": 31900 },
    { "storage": "黑色版", "price_twd": 31900 }
  ]},
  { "id": "apple-watch-s10", "model": "Apple Watch Series 10", "year": 2024, "variants": [
    { "storage": "42mm", "price_twd": 13900 },
    { "storage": "46mm", "price_twd": 14900 }
  ]},
  { "id": "apple-watch-se-2", "model": "Apple Watch SE 2", "year": 2022, "variants": [
    { "storage": "40mm", "price_twd": 8900 },
    { "storage": "44mm", "price_twd": 9900 }
  ]},
  { "id": "apple-watch-ultra-1", "model": "Apple Watch Ultra", "year": 2022, "variants": [
    { "storage": "49mm", "price_twd": 29900 }
  ]},
  { "id": "apple-watch-s9", "model": "Apple Watch Series 9", "year": 2023, "variants": [
    { "storage": "41mm", "price_twd": 13900 },
    { "storage": "45mm", "price_twd": 14900 }
  ]},
  { "id": "apple-watch-s8", "model": "Apple Watch Series 8", "year": 2022, "variants": [
    { "storage": "41mm", "price_twd": 13900 },
    { "storage": "45mm", "price_twd": 14900 }
  ]},
  { "id": "apple-watch-s7", "model": "Apple Watch Series 7", "year": 2021, "variants": [
    { "storage": "41mm", "price_twd": 13900 },
    { "storage": "45mm", "price_twd": 14900 }
  ]},
  { "id": "apple-watch-s6", "model": "Apple Watch Series 6", "year": 2020, "variants": [
    { "storage": "40mm", "price_twd": 13900 },
    { "storage": "44mm", "price_twd": 14900 }
  ]},
  { "id": "apple-watch-s5", "model": "Apple Watch Series 5", "year": 2019, "variants": [
    { "storage": "40mm", "price_twd": 13900 },
    { "storage": "44mm", "price_twd": 14900 }
  ]},
  { "id": "apple-watch-s4", "model": "Apple Watch Series 4", "year": 2018, "variants": [
    { "storage": "40mm", "price_twd": 13900 },
    { "storage": "44mm", "price_twd": 14900 }
  ]},
  { "id": "apple-watch-s3", "model": "Apple Watch Series 3", "year": 2017, "variants": [
    { "storage": "38mm", "price_twd": 9900 },
    { "storage": "42mm", "price_twd": 10900 }
  ]},
  { "id": "apple-watch-s1", "model": "Apple Watch Series 1", "year": 2016, "variants": [
    { "storage": "38mm", "price_twd": 9900 },
    { "storage": "42mm", "price_twd": 10900 }
  ]},
  { "id": "airpods-4-anc", "model": "AirPods 4 ANC", "year": 2024, "variants": [
    { "storage": "標準版", "price_twd": 5990 }
  ]},
  { "id": "airpods-4", "model": "AirPods 4", "year": 2024, "variants": [
    { "storage": "標準版", "price_twd": 4490 }
  ]},
  { "id": "airpods-pro-2", "model": "AirPods Pro 2", "year": 2022, "variants": [
    { "storage": "USB-C", "price_twd": 7990 }
  ]},
  { "id": "airpods-pro-1", "model": "AirPods Pro 1", "year": 2019, "variants": [
    { "storage": "標準版", "price_twd": 7490 }
  ]},
  { "id": "airpods-3", "model": "AirPods 3", "year": 2021, "variants": [
    { "storage": "標準版", "price_twd": 5490 }
  ]},
  { "id": "airpods-2", "model": "AirPods 2", "year": 2019, "variants": [
    { "storage": "標準版", "price_twd": 4490 }
  ]},
  { "id": "airpods-max-2", "model": "AirPods Max 2", "year": 2024, "variants": [
    { "storage": "USB-C", "price_twd": 18990 }
  ]},
  { "id": "airpods-max-1", "model": "AirPods Max 1", "year": 2020, "variants": [
    { "storage": "Lightning", "price_twd": 18990 }
  ]},
  { "id": "homepod-2", "model": "HomePod 2", "year": 2023, "variants": [
    { "storage": "標準版", "price_twd": 9900 }
  ]},
  { "id": "homepod-mini", "model": "HomePod mini", "year": 2020, "variants": [
    { "storage": "標準版", "price_twd": 3300 }
  ]},
  { "id": "homepod-1", "model": "HomePod 1", "year": 2018, "variants": [
    { "storage": "標準版", "price_twd": 10900 }
  ]}
]
```

- [ ] **Step 5：寫入訂閱服務（改為 monthly_price_twd）**

```json
"subscription": [
  { "id": "icloud-12tb", "model": "iCloud+ 12TB", "year": 2023, "variants": [
    { "storage": "12TB", "price_twd": 0, "monthly_price_twd": 1090 }
  ]},
  { "id": "icloud-6tb", "model": "iCloud+ 6TB", "year": 2023, "variants": [
    { "storage": "6TB", "price_twd": 0, "monthly_price_twd": 550 }
  ]},
  { "id": "icloud-2tb", "model": "iCloud+ 2TB", "year": 2017, "variants": [
    { "storage": "2TB", "price_twd": 0, "monthly_price_twd": 130 }
  ]},
  { "id": "icloud-200gb", "model": "iCloud+ 200GB", "year": 2014, "variants": [
    { "storage": "200GB", "price_twd": 0, "monthly_price_twd": 33 }
  ]},
  { "id": "icloud-50gb", "model": "iCloud+ 50GB", "year": 2014, "variants": [
    { "storage": "50GB", "price_twd": 0, "monthly_price_twd": 11 }
  ]},
  { "id": "apple-one-family", "model": "Apple One 家庭版", "year": 2020, "variants": [
    { "storage": "家庭版", "price_twd": 0, "monthly_price_twd": 420 }
  ]},
  { "id": "apple-one", "model": "Apple One 個人版", "year": 2020, "variants": [
    { "storage": "個人版", "price_twd": 0, "monthly_price_twd": 255 }
  ]},
  { "id": "apple-music-family", "model": "Apple Music 家庭版", "year": 2015, "variants": [
    { "storage": "家庭版", "price_twd": 0, "monthly_price_twd": 199 }
  ]},
  { "id": "apple-music-individual", "model": "Apple Music 個人版", "year": 2015, "variants": [
    { "storage": "個人版", "price_twd": 0, "monthly_price_twd": 149 }
  ]},
  { "id": "apple-music-student", "model": "Apple Music 學生版", "year": 2015, "variants": [
    { "storage": "學生版", "price_twd": 0, "monthly_price_twd": 75 }
  ]},
  { "id": "apple-tv-plus", "model": "Apple TV+", "year": 2019, "variants": [
    { "storage": "標準版", "price_twd": 0, "monthly_price_twd": 149 }
  ]},
  { "id": "apple-arcade", "model": "Apple Arcade", "year": 2019, "variants": [
    { "storage": "標準版", "price_twd": 0, "monthly_price_twd": 98 }
  ]}
]
```

- [ ] **Step 6：commit**

```bash
git add data/products.json
git commit -m "data: complete Apple product catalog 2007-2025 with all models"
```

---

## Task B：下載產品圖到本地

**Files:**
- Create: `scripts/download-product-images.mjs`
- Create: `public/images/products/` (目錄，內含 .png 檔)

- [ ] **Step 1：建立圖片對照表與下載腳本**

```js
// scripts/download-product-images.mjs
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const OUTPUT_DIR = 'public/images/products'
if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true })

// Apple Store CDN 圖片 key 對照表
// URL 格式: https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/{key}?wid=400&hei=400&fmt=png-alpha&.v=...
const IMAGE_MAP = {
  'iphone-17-pro-max': 'iphone-17-pro-max-finish-select-202509-desert-titanium',
  'iphone-17-pro': 'iphone-17-pro-finish-select-202509-desert-titanium',
  'iphone-17-plus': 'iphone-17-finishselect-202509-6-9inch-teal',
  'iphone-17': 'iphone-17-finishselect-202509-6-1inch-teal',
  'iphone-16e': 'iphone-16e-finishselect-202502-teal',
  'iphone-16-pro-max': 'iphone-16-pro-max-finish-select-202409-deserttitanium',
  'iphone-16-pro': 'iphone-16-pro-finish-select-202409-deserttitanium',
  'iphone-16-plus': 'iphone-16-plus-finish-select-202409-6-7inch-ultramarine',
  'iphone-16': 'iphone-16-finish-select-202409-6-1inch-ultramarine',
  'iphone-15-pro-max': 'iphone-15-pro-max-naturaltitanium-select',
  'iphone-15-pro': 'iphone-15-pro-naturaltitanium-select',
  'iphone-15-plus': 'iphone-15-plus-blue-select-2023',
  'iphone-15': 'iphone-15-blue-select-2023',
  'iphone-14-pro-max': 'iphone-14-pro-max-deeptitanium-select',
  'iphone-14-pro': 'iphone-14-pro-deeptitanium-select',
  'iphone-14-plus': 'iphone-14-plus-purple-select',
  'iphone-14': 'iphone-14-purple-select',
  'iphone-13-pro-max': 'iphone-13-pro-max-sierrablue-select',
  'iphone-13-pro': 'iphone-13-pro-sierrablue-select',
  'iphone-13-mini': 'iphone-13-mini-blue-select-2021',
  'iphone-13': 'iphone-13-blue-select-2021',
  'iphone-12-pro-max': 'iphone-12-pro-max-pacific-blue-select',
  'iphone-12-pro': 'iphone-12-pro-pacific-blue-select',
  'iphone-12-mini': 'iphone-12-mini-blue-select-2020',
  'iphone-12': 'iphone-12-blue-select-2020',
  'macbook-air-13-m4': 'macbook-air-m4-13-starlight-select-202503',
  'macbook-air-15-m4': 'macbook-air-m4-15-starlight-select-202503',
  'macbook-pro-14-m4': 'mbp-14-spaceblack-select-202410',
  'macbook-pro-16-m4-pro': 'mbp-16-spaceblack-select-202410',
  'imac-m4': 'imac-24-blue-select-202410',
  'mac-mini-m4': 'mac-mini-select-202410-silver',
  'mac-studio-m4-max': 'mac-studio-select-202503',
  'ipad-pro-13-m4': 'ipad-pro-13-select-cell-202405-silver',
  'ipad-pro-11-m4': 'ipad-pro-11-select-cell-202405-silver',
  'ipad-air-13-m3': 'ipad-air-13-m3-select-202503-blue',
  'ipad-air-11-m3': 'ipad-air-11-m3-select-202503-blue',
  'ipad-mini-7': 'ipad-mini-select-202409-blue',
  'ipad-10': 'ipad-10gen-blue-select-202212',
  'vision-pro': 'sku-109-202401',
  'apple-watch-ultra-2': 'watch-ultra2-49-titanium-ocean-band-select-202309_FV1',
  'apple-watch-s10': 'watch-s10-46-alum-jetblack-nc-sl-202409_FV1',
  'apple-watch-se-2': 'watch-se-40-alum-midnight-nc-sl-202209_FV1',
  'airpods-4-anc': 'airpods-4-select-anc-202409',
  'airpods-4': 'airpods-4-select-202409',
  'airpods-pro-2': 'airpods-pro-2nd-gen-with-magsafe-case-usbc-202309',
  'airpods-max-2': 'airpods-max-select-202409-midnight',
  'homepod-2': 'homepod-2nd-generation-select',
  'homepod-mini': 'homepod-mini-select-yellow-2021',
}

const BASE = 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is'

async function download(id, key) {
  const url = `${BASE}/${key}?wid=400&hei=400&fmt=png-alpha&.v=1`
  const outPath = join(OUTPUT_DIR, `${id}.png`)
  try {
    const res = await fetch(url)
    if (!res.ok) { console.warn(`SKIP ${id}: HTTP ${res.status}`); return }
    const buf = await res.arrayBuffer()
    writeFileSync(outPath, Buffer.from(buf))
    console.log(`OK   ${id}`)
  } catch (e) {
    console.warn(`FAIL ${id}: ${e.message}`)
  }
}

for (const [id, key] of Object.entries(IMAGE_MAP)) {
  await download(id, key)
  await new Promise(r => setTimeout(r, 100)) // throttle
}
console.log('Done.')
```

- [ ] **Step 2：執行下載**

```bash
node scripts/download-product-images.mjs
```

Expected: 每個產品輸出 `OK {id}`，少數舊款可能 SKIP（CDN 已移除）

- [ ] **Step 3：commit 圖片**

```bash
git add public/images/products/ scripts/download-product-images.mjs
git commit -m "feat: add Apple product images downloaded from CDN"
```

---

## Task C：更新型別 `app/lib/types.ts`

**Files:**
- Modify: `app/lib/types.ts`

- [ ] **Step 1：更新型別**

```typescript
export interface ProductVariant {
  storage: string
  price_twd: number
  monthly_price_twd?: number  // 訂閱用，price_twd 由 UI 動態計算
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
  quantity: number  // 新增：同樣商品買幾次
}
```

- [ ] **Step 2：commit**

```bash
git add app/lib/types.ts
git commit -m "feat: add quantity to Selection, monthly_price_twd to ProductVariant"
```

---

## Task D：更新 `app/lib/calculations.ts` + 測試

**Files:**
- Modify: `app/lib/calculations.ts`
- Modify: `app/lib/calculations.test.ts`

- [ ] **Step 1：更新 calcTotal 乘以 quantity**

```typescript
export function calcTotal(selections: Selection[]): number {
  return selections.reduce((sum, s) => sum + s.price_twd * s.quantity, 0)
}
```

- [ ] **Step 2：更新測試**

```typescript
describe('calcTotal', () => {
  it('returns 0 for empty array', () => {
    expect(calcTotal([])).toBe(0)
  })
  it('sums prices', () => {
    const s = makeSelection({ price_twd: 10000, quantity: 1 })
    expect(calcTotal([s])).toBe(10000)
  })
  it('multiplies by quantity', () => {
    const s = makeSelection({ price_twd: 10000, quantity: 3 })
    expect(calcTotal([s])).toBe(30000)
  })
  it('sums multiple selections with different quantities', () => {
    const a = makeSelection({ price_twd: 30000, quantity: 2 })
    const b = makeSelection({ price_twd: 10000, quantity: 1 })
    expect(calcTotal([a, b])).toBe(70000)
  })
})

function makeSelection(overrides: Partial<Selection>): Selection {
  return {
    productId: 'test', model: 'Test', variant: '128GB',
    price_twd: 10000, year: 2024,
    category: 'iphone', quantity: 1,
    ...overrides,
  }
}
```

- [ ] **Step 3：跑測試確認通過**

```bash
npx vitest run
```

Expected: all tests pass

- [ ] **Step 4：commit**

```bash
git add app/lib/calculations.ts app/lib/calculations.test.ts
git commit -m "feat: calcTotal respects quantity field"
```

---

## Task E：新增 `app/components/SubscriptionCard.tsx`

**Files:**
- Create: `app/components/SubscriptionCard.tsx`

- [ ] **Step 1：實作訂閱卡（自訂月數）**

```tsx
import { useState } from 'react'
import type { Product, Selection } from '~/lib/types'

interface Props {
  product: Product
  selections: Selection[]
  onUpdate: (selection: Selection, quantity: number) => void
}

export function SubscriptionCard({ product, selections, onUpdate }: Props) {
  const [expanded, setExpanded] = useState(false)
  const selectedSubs = selections.filter(s => s.productId === product.id)
  const hasSelection = selectedSubs.length > 0

  return (
    <div
      className="border rounded-xl transition-all"
      style={hasSelection
        ? { borderColor: '#FF9F0A', backgroundColor: '#2C2C2E' }
        : { borderColor: '#3A3A3C', backgroundColor: '#2C2C2E' }
      }
    >
      <button
        className="w-full p-4 flex items-center justify-between text-left"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-3">
          <img
            src={`/images/products/${product.id}.png`}
            alt={product.model}
            className="w-10 h-10 object-contain"
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
          <div>
            <div className="font-semibold" style={{ color: '#FFFFFF' }}>{product.model}</div>
            <div className="text-xs" style={{ color: '#AEAEB2' }}>
              每月 NT${product.variants[0]?.monthly_price_twd}
            </div>
          </div>
        </div>
        <span style={{ color: '#AEAEB2' }}>{expanded ? '▲' : '▶'}</span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t" style={{ borderColor: '#3A3A3C' }}>
          {product.variants.map(variant => {
            const sel = selectedSubs.find(s => s.variant === variant.storage)
            const months = sel ? sel.price_twd / (variant.monthly_price_twd ?? 1) : 12
            const [localMonths, setLocalMonths] = useState(Math.round(months))

            const handleChange = (val: number) => {
              const clamped = Math.max(1, val)
              setLocalMonths(clamped)
              if (sel || clamped > 0) {
                onUpdate({
                  productId: product.id,
                  model: product.model,
                  variant: `${variant.storage} × ${clamped}個月`,
                  price_twd: (variant.monthly_price_twd ?? 0) * clamped,
                  year: product.year,
                  category: 'subscription',
                  quantity: 1,
                }, 1)
              }
            }

            return (
              <div key={variant.storage} className="flex items-center justify-between py-3">
                <div style={{ color: '#AEAEB2' }}>NT${variant.monthly_price_twd}/月</div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={localMonths}
                    onChange={e => handleChange(parseInt(e.target.value) || 0)}
                    className="w-20 text-center rounded-lg px-2 py-1 text-sm"
                    style={{ backgroundColor: '#1C1C1E', color: '#FFFFFF', border: '1px solid #3A3A3C' }}
                  />
                  <span style={{ color: '#AEAEB2' }}>個月</span>
                </div>
                {localMonths > 0 && (
                  <div className="text-sm font-semibold" style={{ color: '#FF9F0A' }}>
                    NT${((variant.monthly_price_twd ?? 0) * localMonths).toLocaleString()}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2：commit**

```bash
git add app/components/SubscriptionCard.tsx
git commit -m "feat: add SubscriptionCard with custom month input"
```

---

## Task F：重寫 `app/components/ProductCard.tsx`

**Files:**
- Modify: `app/components/ProductCard.tsx`

- [ ] **Step 1：改為折疊式 + quantity counter**

```tsx
import { useState } from 'react'
import type { Product, Selection } from '~/lib/types'

interface Props {
  product: Product
  category: Selection['category']
  selections: Selection[]
  onUpdate: (selection: Selection, quantity: number) => void
}

export function ProductCard({ product, category, selections, onUpdate }: Props) {
  const selectedForProduct = selections.filter(s => s.productId === product.id)
  const hasSelection = selectedForProduct.length > 0
  const [expanded, setExpanded] = useState(hasSelection)

  return (
    <div
      className="border rounded-xl transition-all"
      style={hasSelection
        ? { borderColor: '#FF9F0A', backgroundColor: '#2C2C2E' }
        : { borderColor: '#3A3A3C', backgroundColor: '#2C2C2E' }
      }
    >
      <button
        className="w-full p-4 flex items-center justify-between text-left"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-3">
          <img
            src={`/images/products/${product.id}.png`}
            alt={product.model}
            className="w-10 h-10 object-contain"
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
          <div>
            <div className="font-semibold" style={{ color: '#FFFFFF' }}>{product.model}</div>
            <div className="text-sm" style={{ color: '#AEAEB2' }}>{product.year}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {hasSelection && (
            <span className="text-sm font-semibold" style={{ color: '#FF9F0A' }}>
              NT${selectedForProduct.reduce((s, i) => s + i.price_twd * i.quantity, 0).toLocaleString()}
            </span>
          )}
          <span style={{ color: '#AEAEB2' }}>{expanded ? '▲' : '▶'}</span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t" style={{ borderColor: '#3A3A3C' }}>
          {product.variants.map(variant => {
            const sel = selectedForProduct.find(s => s.variant === variant.storage)
            const qty = sel?.quantity ?? 0

            return (
              <div key={variant.storage} className="flex items-center justify-between py-2">
                <div>
                  <span className="text-sm" style={{ color: '#FFFFFF' }}>{variant.storage}</span>
                  <span className="text-xs ml-2" style={{ color: '#636366' }}>NT${variant.price_twd.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={qty === 0}
                    onClick={() => onUpdate({
                      productId: product.id, model: product.model,
                      variant: variant.storage, price_twd: variant.price_twd,
                      year: product.year, category, quantity: qty - 1,
                    }, qty - 1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-opacity"
                    style={{ backgroundColor: '#3A3A3C', color: qty === 0 ? '#636366' : '#FFFFFF' }}
                  >−</button>
                  <span className="w-6 text-center text-sm" style={{ color: '#FFFFFF' }}>{qty}</span>
                  <button
                    onClick={() => onUpdate({
                      productId: product.id, model: product.model,
                      variant: variant.storage, price_twd: variant.price_twd,
                      year: product.year, category, quantity: qty + 1,
                    }, qty + 1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold"
                    style={{ backgroundColor: '#FF9F0A', color: '#000000' }}
                  >+</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2：commit**

```bash
git add app/components/ProductCard.tsx
git commit -m "feat: accordion ProductCard with per-variant quantity counter"
```

---

## Task G：更新 `app/components/ProductTabs.tsx`

**Files:**
- Modify: `app/components/ProductTabs.tsx`

- [ ] **Step 1：移除快選區、改用 SubscriptionCard、傳 onUpdate**

```tsx
import { useState } from 'react'
import { ProductCard } from './ProductCard'
import { SubscriptionCard } from './SubscriptionCard'
import type { Selection } from '~/lib/types'
import productsData from '../../data/products.json'

const TABS = [
  { key: 'iphone', label: 'iPhone', emoji: '📱' },
  { key: 'mac', label: 'Mac', emoji: '💻' },
  { key: 'ipad', label: 'iPad', emoji: '🖥️' },
  { key: 'wearable', label: '穿戴', emoji: '⌚' },
  { key: 'subscription', label: '訂閱', emoji: '☁️' },
] as const

interface Props {
  selections: Selection[]
  onUpdate: (selection: Selection, quantity: number) => void
}

export function ProductTabs({ selections, onUpdate }: Props) {
  const [activeTab, setActiveTab] = useState<string>('iphone')
  const products = (productsData as Record<string, typeof productsData.iphone>)[activeTab] ?? []
  const category = activeTab as Selection['category']

  return (
    <div>
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
            style={activeTab === tab.key
              ? { backgroundColor: '#FF9F0A', color: '#000000' }
              : { backgroundColor: '#2C2C2E', color: '#AEAEB2', border: '1px solid #3A3A3C' }
            }
          >
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {products.map(product =>
          activeTab === 'subscription'
            ? <SubscriptionCard
                key={product.id}
                product={product}
                selections={selections}
                onUpdate={onUpdate}
              />
            : <ProductCard
                key={product.id}
                product={product}
                category={category}
                selections={selections}
                onUpdate={onUpdate}
              />
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2：commit**

```bash
git add app/components/ProductTabs.tsx
git commit -m "feat: remove quick picks, use SubscriptionCard for subscriptions"
```

---

## Task H：更新 `app/routes/products.tsx` — handleUpdate 邏輯

**Files:**
- Modify: `app/routes/products.tsx`

- [ ] **Step 1：將 handleToggle 換成 handleUpdate（支援 quantity）**

```typescript
const handleUpdate = useCallback((incoming: Selection, quantity: number) => {
  setSelections(prev => {
    // 移除 quantity = 0 的項目
    if (quantity <= 0) {
      return prev.filter(s =>
        !(s.productId === incoming.productId && s.variant === incoming.variant)
      )
    }
    // 更新或新增
    const exists = prev.find(
      s => s.productId === incoming.productId && s.variant === incoming.variant
    )
    if (exists) {
      return prev.map(s =>
        s.productId === incoming.productId && s.variant === incoming.variant
          ? { ...s, quantity, price_twd: incoming.price_twd }
          : s
      )
    }
    return [...prev, { ...incoming, quantity }]
  })
}, [])
```

把 `ProductTabs` 的 prop 從 `onToggle` 改成 `onUpdate={handleUpdate}`。

- [ ] **Step 2：commit**

```bash
git add app/routes/products.tsx
git commit -m "feat: handleUpdate supports quantity and multiple variants per product"
```

---

## 驗收清單

- [ ] iPhone 全系列（2007–2025）都出現在列表，由新到舊
- [ ] Mac / iPad / 穿戴完整，不缺主力機型
- [ ] 同型號 256GB 和 512GB 可以同時選，各自顯示在 Receipt
- [ ] 同型號同規格可以選到 quantity = 2（同一台買兩次）
- [ ] 訂閱卡輸入 24 個月，小計 = 月費 × 24
- [ ] 產品圖顯示（至少新款有圖，舊款 graceful fallback 無圖）
- [ ] Receipt 顯示每個 selection 的數量（如：`iPhone 16 Pro ×2`）
- [ ] `npx vitest run` 全過
