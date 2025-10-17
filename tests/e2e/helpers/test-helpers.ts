/**
 * Test Helper Utilities
 * 
 * Common helper functions for E2E tests.
 */

import { Page, expect } from '@playwright/test';

/**
 * Navigate to a page and wait for it to be fully loaded
 */
export async function navigateAndWait(page: Page, url: string) {
  await page.goto(url, { waitUntil: 'networkidle' });
}

/**
 * Fill a form field by label text
 */
export async function fillByLabel(page: Page, labelText: string, value: string) {
  const input = page.locator(`label:has-text("${labelText}")`).locator('..').locator('input, textarea, select');
  await input.fill(value);
}

/**
 * Click a button by text content
 */
export async function clickButton(page: Page, text: string) {
  await page.locator('button').filter({ hasText: new RegExp(text, 'i') }).first().click();
}

/**
 * Wait for a toast or notification message
 */
export async function waitForToast(page: Page, message: string) {
  await expect(
    page.locator('[role="alert"], [role="status"], .toast, .notification').filter({ hasText: message })
  ).toBeVisible({ timeout: 5000 });
}

/**
 * Check if user is on a specific page
 */
export async function expectPageUrl(page: Page, urlPattern: string | RegExp) {
  if (typeof urlPattern === 'string') {
    await expect(page).toHaveURL(new RegExp(urlPattern));
  } else {
    await expect(page).toHaveURL(urlPattern);
  }
}

/**
 * Wait for loading state to complete
 */
export async function waitForLoadingComplete(page: Page) {
  // Wait for any loading spinners to disappear
  await page.waitForSelector('[data-loading="true"], .loading, .spinner', { 
    state: 'hidden',
    timeout: 10000 
  }).catch(() => {
    // Ignore if no loading state found
  });
}

/**
 * Select a pricing tier card
 */
export async function selectPricingTier(page: Page, tierName: 'free' | 'basic' | 'premium') {
  const tierCard = page.locator(`[data-tier="${tierName}"]`).or(
    page.locator(`text=${tierName}`, { exact: false }).locator('..').locator('..')
  );
  return tierCard;
}

/**
 * Click subscribe button for a specific tier
 */
export async function subscribeToTier(page: Page, tierName: 'free' | 'basic' | 'premium') {
  const tierCard = await selectPricingTier(page, tierName);
  const subscribeButton = tierCard
    .locator('button')
    .filter({ hasText: /Get Started|Subscribe|Upgrade|Start Trial/i })
    .first();
  
  await subscribeButton.click();
}

/**
 * Toggle billing cycle on pricing page
 */
export async function toggleBillingCycle(page: Page, cycle: 'monthly' | 'annual') {
  const button = page.getByRole('button', { name: new RegExp(cycle, 'i') });
  await button.click();
  await page.waitForTimeout(300); // Wait for UI to update
}

/**
 * Get current subscription status text
 */
export async function getSubscriptionStatus(page: Page): Promise<string> {
  const statusElement = page
    .locator('[data-testid="subscription-status"], [data-status]')
    .or(page.locator('text=/Status|Tier|Plan/i').locator('..'));
  
  return await statusElement.textContent() || '';
}

/**
 * Check if element contains text (case insensitive)
 */
export async function expectTextContains(page: Page, selector: string, text: string) {
  await expect(page.locator(selector)).toContainText(new RegExp(text, 'i'));
}

/**
 * Wait for navigation to complete
 */
export async function waitForNavigation(page: Page, urlPattern?: string | RegExp) {
  if (urlPattern) {
    await page.waitForURL(urlPattern, { timeout: 10000 });
  } else {
    await page.waitForLoadState('networkidle');
  }
}

/**
 * Take a screenshot with a descriptive name
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({ 
    path: `test-results/${name}-${Date.now()}.png`,
    fullPage: true 
  });
}

/**
 * Mock API response
 */
export async function mockApiResponse(
  page: Page, 
  endpoint: string, 
  response: any, 
  status: number = 200
) {
  await page.route(`**${endpoint}`, (route) => {
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
}

/**
 * Wait for API call to complete
 */
export async function waitForApiCall(page: Page, endpoint: string) {
  return await page.waitForResponse((response) => 
    response.url().includes(endpoint) && response.status() === 200,
    { timeout: 10000 }
  );
}

/**
 * Get all error messages on page
 */
export async function getErrorMessages(page: Page): Promise<string[]> {
  const errors = page.locator('[role="alert"], .error, [data-error]');
  const count = await errors.count();
  const messages: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const text = await errors.nth(i).textContent();
    if (text) messages.push(text);
  }
  
  return messages;
}

/**
 * Clear all cookies and storage
 */
export async function clearSession(page: Page) {
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * Wait for element to be clickable
 */
export async function waitForClickable(page: Page, selector: string) {
  const element = page.locator(selector);
  await element.waitFor({ state: 'visible' });
  await expect(element).toBeEnabled();
  return element;
}

/**
 * Scroll element into view
 */
export async function scrollIntoView(page: Page, selector: string) {
  await page.locator(selector).scrollIntoViewIfNeeded();
}

/**
 * Get table data as array of objects
 */
export async function getTableData(page: Page, tableSelector: string): Promise<any[]> {
  return await page.evaluate((selector) => {
    const table = document.querySelector(selector);
    if (!table) return [];
    
    const headers: string[] = [];
    const headerCells = table.querySelectorAll('thead th');
    headerCells.forEach(cell => headers.push(cell.textContent?.trim() || ''));
    
    const rows: any[] = [];
    const bodyRows = table.querySelectorAll('tbody tr');
    bodyRows.forEach(row => {
      const rowData: any = {};
      const cells = row.querySelectorAll('td');
      cells.forEach((cell, index) => {
        rowData[headers[index]] = cell.textContent?.trim() || '';
      });
      rows.push(rowData);
    });
    
    return rows;
  }, tableSelector);
}

/**
 * Wait for multiple conditions
 */
export async function waitForAll(page: Page, conditions: (() => Promise<any>)[]) {
  await Promise.all(conditions.map(condition => condition()));
}

/**
 * Retry an action until it succeeds or times out
 */
export async function retryUntilSuccess<T>(
  action: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await action();
    } catch (error) {
      lastError = error as Error;
      if (i < maxAttempts - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  
  throw lastError || new Error('Action failed after retries');
}

/**
 * Check if running in CI environment
 */
export function isCI(): boolean {
  return !!process.env.CI;
}

/**
 * Get base URL for tests
 */
export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

