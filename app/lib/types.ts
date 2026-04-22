export interface ProductVariant {
  storage: string
  price_twd: number
  monthly_price_twd?: number
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
  quantity: number
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
