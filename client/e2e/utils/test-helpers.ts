import { Page } from '@playwright/test';

export async function createTestCar(page: Page, carData: {
  name: string;
  year: string;
  chassisNumber: string;
}) {
  await page.goto('/');
  await page.fill('[name="name"]', carData.name);
  await page.fill('[name="year"]', carData.year);
  await page.fill('[name="chassisNumber"]', carData.chassisNumber);
  await page.click('button[type="submit"]');
  // Wait for car to appear
  await page.waitForSelector(`text=${carData.name}`);
}

export async function addHistoryEvent(page: Page, eventData: {
  title: string;
  date: string;
  description: string;
}) {
  await page.fill('[name="title"]', eventData.title);
  await page.fill('[name="date"]', eventData.date);
  await page.fill('[name="description"]', eventData.description);
  await page.click('button:has-text("Create")');
  // Wait for event to appear
  await page.waitForSelector(`text=${eventData.title}`);
} 