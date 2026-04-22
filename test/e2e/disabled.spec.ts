import { test, expect } from '@playwright/test'

test('未選擇任何產品時計算按鈕應為 disabled', async ({ page }) => {
  await page.goto('/products')

  const button = page.getByRole('button', { name: '計算 →' })
  await expect(button).toBeDisabled()
})
