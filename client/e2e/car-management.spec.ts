import { test, expect } from '@playwright/test';

test.describe('Car Management', () => {
  test('should create a new car and view it', async ({ page }) => {
    await page.goto('/');

    // Fill car form with unique data
    await page.fill('[name="name"]', 'Test Porsche 911');
    await page.fill('[name="year"]', '1985');
    await page.fill('[name="chassisNumber"]', 'WP0ZZZ91ZFS123456');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for car to appear in list
    await expect(page.locator('text=Test Porsche 911')).toBeVisible();
    await expect(page.locator('text=1985')).toBeVisible();
    await expect(page.locator('text=#WP0ZZZ91ZFS123456')).toBeVisible();
  });

  test('should navigate to car details and add history', async ({ page }) => {
    // Create a car with unique data
    await page.goto('/');
    await page.fill('[name="name"]', 'Test Ferrari F40');
    await page.fill('[name="year"]', '1990');
    await page.fill('[name="chassisNumber"]', 'ZFFMN34A1L0091234');
    await page.click('button[type="submit"]');

    // Click on car card to navigate to details
    await page.click('text=Test Ferrari F40');

    // Verify we're on car details page
    await expect(page.locator('h1:has-text("1990 Test Ferrari F40")')).toBeVisible();

    // Add history event with unique title and description
    await page.fill('[name="title"]', 'Engine Rebuild - Ferrari');
    await page.fill('[name="date"]', '2024-01-15');
    await page.fill('[name="description"]', 'Complete Ferrari engine rebuild with new pistons and turbo');
    await page.click('button:has-text("Create")');

    // Verify history event appears
    await expect(page.locator('text=Engine Rebuild - Ferrari')).toBeVisible();
    await expect(page.locator('text=Complete Ferrari engine rebuild')).toBeVisible();
  });

  test('should delete history event', async ({ page }) => {
    // Create a car with unique data
    await page.goto('/');
    await page.fill('[name="name"]', 'Test McLaren F1');
    await page.fill('[name="year"]', '1995');
    await page.fill('[name="chassisNumber"]', 'SBM12AAE1KC000123');
    await page.click('button[type="submit"]');

    // Click on car card to navigate to details
    await page.click('text=Test McLaren F1');

    // Add history event with unique title and description
    await page.fill('[name="title"]', 'Gearbox Overhaul - McLaren');
    await page.fill('[name="date"]', '2024-02-20');
    await page.fill('[name="description"]', 'Complete McLaren gearbox overhaul and clutch replacement');
    await page.click('button:has-text("Create")');

    // Wait for the history event to appear
    await expect(page.locator('text=Gearbox Overhaul - McLaren')).toBeVisible();

    // Click the delete button for this specific event
    const historyItem = page.locator('li.history-list:has-text("Gearbox Overhaul - McLaren")');
    const deleteButton = historyItem.locator('button:has-text("Delete")');
    await deleteButton.click();

    // Wait for deletion to complete
    await page.waitForTimeout(2000);
    
    // Verify event is removed
    await expect(page.locator('text=Gearbox Overhaul - McLaren')).not.toBeVisible();
  });
});