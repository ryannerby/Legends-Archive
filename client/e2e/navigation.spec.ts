import { test, expect } from '@playwright/test';

test.describe('Navigation E2E', () => {
  test('should navigate between pages', async ({ page }) => {
    await page.goto('/');
    
    // Verify home page elements
    await expect(page.locator('h1:has-text("The new way to track old racecars")')).toBeVisible();
    await expect(page.locator('h2:has-text("Add a new car")')).toBeVisible();
    
    // Test external link (verify it opens in new tab)
    const externalLink = page.locator('a[href="https://www.racecar-classifieds.com/"]');
    await expect(externalLink).toHaveAttribute('target', '_blank');
  });
}); 