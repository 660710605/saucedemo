import { test, expect } from '@playwright/test';
//1
test('Login สำเร็จ', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  await expect(page).toHaveURL(/inventory.html/);
  await expect(page.locator('.title')).toHaveText('Products');
  await expect(page.locator('.inventory_item')).toHaveCount(6);
});

//2
test('Add และ Remove สินค้าใน Cart', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  // Login
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  // Add Sauce Labs Backpack 
  await page.locator('.inventory_item')
    .filter({ hasText: 'Sauce Labs Backpack' })
    .getByRole('button', { name: 'Add to cart' })
    .click();

  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  // Add Sauce Labs Bike Light
await page.locator('.inventory_item')
  .filter({ hasText: 'Sauce Labs Bike Light' })
  .getByRole('button', { name: 'Add to cart' })
  .click();

await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

// Remove Backpack
await page.locator('.inventory_item')
  .filter({ hasText: 'Sauce Labs Backpack' })
  .getByRole('button', { name: 'Remove' })
  .click();

await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
});

//3
test('Assertions เชิงลึก', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  // Login ด้วย password ผิด
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('wrong_password');
  await page.locator('[data-test="login-button"]').click();

  // Error message toBeVisible()
  await expect(page.locator('[data-test="error"]')).toBeVisible();

  // Error message toContainText('do not match')
  await expect(page.locator('[data-test="error"]'))
    .toContainText('do not match');

  // Username field มี CSS class error
  await expect(page.locator('[data-test="username"]'))
    .toHaveClass(/error/);

  // กดปุ่ม X ปิด error — Assert ว่า Error message not.toBeVisible()
  await page.locator('.error-button').click();
  await expect(page.locator('[data-test="error"]')).not.toBeVisible();

  // Login ใหม่
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  // Sort สินค้าแบบ Price Low to High 
  await page.locator('[data-test="product-sort-container"]')
    .selectOption('lohi');

  // Assert ว่าสินค้าแรกมีราคา $7.99
  await expect(
    page.locator('.inventory_item_price').first()
  ).toHaveText('$7.99');
});