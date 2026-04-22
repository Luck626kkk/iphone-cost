import { test, expect } from '@playwright/test'

test('完整流程：選 iPhone → 拿到收據', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: '開始計算 →' }).click()

  await expect(page).toHaveURL('/products')

  await page.getByText('iPhone 15 Pro').first().waitFor()

  // Click 256GB within the iPhone 15 Pro card specifically
  const iphone15ProCard = page.locator('div').filter({ hasText: /^iPhone 15 Pro/ }).first()
  await iphone15ProCard.getByText('256GB').click()

  await expect(page.getByText('NT$40,900').first()).toBeVisible()

  await page.getByRole('button', { name: '計算 →' }).click()

  await expect(page).toHaveURL('/result')

  await expect(page.getByText('你的 Apple 稅')).toBeVisible()
  await expect(page.getByText('下載分享圖片')).toBeVisible()
})
