import { test, expect } from '@playwright/test';

test('Text', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.getByText('Welcome, employee')).toBeVisible();
});

test('Image', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page.getByText('Welcome, employee')).toBeVisible();
  });