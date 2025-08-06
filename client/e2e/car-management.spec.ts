import { test, expect } from '@playwright/test';
import { createTestCar, addHistoryEvent, navigateToCarDetails, deleteHistoryEvent } from './utils/test-helpers';

test.describe('Car Management', () => {
  test('should create a new car and view it', async ({ page }) => {
    const carData = {
      name: 'Test Porsche 911',
      year: '1985',
      chassisNumber: 'WP0ZZZ91ZFS123456'
    };

    await createTestCar(page, carData);

    // Verify car appears in list
    await expect(page.locator(`text=${carData.name}`)).toBeVisible();
    await expect(page.locator(`text=${carData.year}`)).toBeVisible();
    await expect(page.locator(`text=#${carData.chassisNumber}`)).toBeVisible();
  });

  test('should navigate to car details and add history', async ({ page }) => {
    const carData = {
      name: 'Test Ferrari F40',
      year: '1990',
      chassisNumber: 'ZFFMN34A1L0091234'
    };

    const historyData = {
      title: 'Engine Rebuild - Ferrari',
      date: '2024-01-15',
      description: 'Complete Ferrari engine rebuild with new pistons and turbo'
    };

    // Create car and navigate to details
    await createTestCar(page, carData);
    await navigateToCarDetails(page, carData.name);

    // Verify we're on car details page
    await expect(page.locator(`h1:has-text("${carData.year} ${carData.name}")`)).toBeVisible();

    // Add history event
    await addHistoryEvent(page, historyData);

    // Verify history event appears
    await expect(page.locator(`text=${historyData.title}`)).toBeVisible();
    await expect(page.locator(`text=${historyData.description}`)).toBeVisible();
  });

  test('should delete history event', async ({ page }) => {
    const carData = {
      name: 'Test McLaren F1',
      year: '1995',
      chassisNumber: 'SBM12AAE1KC000123'
    };

    const historyData = {
      title: 'Gearbox Overhaul - McLaren',
      date: '2024-02-20',
      description: 'Complete McLaren gearbox overhaul and clutch replacement'
    };

    // Setup: Create car, navigate to details, and add history
    await createTestCar(page, carData);
    await navigateToCarDetails(page, carData.name);
    await addHistoryEvent(page, historyData);

    // Verify event exists before deletion
    await expect(page.locator(`text=${historyData.title}`)).toBeVisible();

    // Delete the history event
    await deleteHistoryEvent(page, historyData.title);
    
    // Verify event is removed
    await expect(page.locator(`text=${historyData.title}`)).not.toBeVisible();
  });
});