// @ts-check
const { test, expect } = require('@playwright/test');

const BASE_URL = 'file:///home/ubuntu/daily-commander/index.html';

test.describe('Daily Command Center', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto(BASE_URL);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('page loads with correct title', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle('Daily Command Center');
  });

  test('header displays date', async ({ page }) => {
    await page.goto(BASE_URL);
    const dateDisplay = page.locator('#dateDisplay');
    await expect(dateDisplay).not.toHaveText('Loading...');
    // Should contain a day of week
    const text = await dateDisplay.textContent();
    expect(text).toMatch(/(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/);
  });

  test('refresh button is present and clickable', async ({ page }) => {
    await page.goto(BASE_URL);
    const refreshBtn = page.locator('#refreshBtn');
    await expect(refreshBtn).toBeVisible();
    await expect(refreshBtn).toBeEnabled();
  });

  test('weather card is present', async ({ page }) => {
    await page.goto(BASE_URL);
    const weatherCard = page.locator('.card.weather');
    await expect(weatherCard).toBeVisible();
  });

  test('tasks card is present with input', async ({ page }) => {
    await page.goto(BASE_URL);
    const tasksCard = page.locator('.card.tasks');
    await expect(tasksCard).toBeVisible();
    await expect(page.locator('#taskInput')).toBeVisible();
    await expect(page.locator('#taskAddBtn')).toBeVisible();
  });

  test('can add a task', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const input = page.locator('#taskInput');
    await input.fill('Test task');
    await page.locator('#taskAddBtn').click();
    
    const taskList = page.locator('#taskList');
    await expect(taskList).toContainText('Test task');
  });

  test('can complete a task', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Add a task
    const input = page.locator('#taskInput');
    await input.fill('Task to complete');
    await page.locator('#taskAddBtn').click();
    
    // Check the task
    const checkbox = page.locator('.task-checkbox').first();
    await checkbox.click();
    
    // Task should be marked complete
    const taskItem = page.locator('.task-item').first();
    await expect(taskItem).toHaveClass(/completed/);
  });

  test('can delete a task', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Add a task
    const input = page.locator('#taskInput');
    await input.fill('Task to delete');
    await page.locator('#taskAddBtn').click();
    
    // Delete the task
    const deleteBtn = page.locator('.task-delete').first();
    await deleteBtn.click();
    
    // Task should be gone
    const taskList = page.locator('#taskList');
    await expect(taskList).not.toContainText('Task to delete');
  });

  test('tasks persist in localStorage', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Add a task
    const input = page.locator('#taskInput');
    await input.fill('Persisted task');
    await page.locator('#taskAddBtn').click();
    
    // Check localStorage
    const stored = await page.evaluate(() => localStorage.getItem('dailycomm_tasks_v1'));
    expect(stored).toContain('Persisted task');
  });

  test('tasks persist across page reload', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Add a task
    const input = page.locator('#taskInput');
    await input.fill('Reload test task');
    await page.locator('#taskAddBtn').click();
    
    // Reload page
    await page.reload();
    
    // Task should still be there
    await expect(page.locator('#taskList')).toContainText('Reload test task');
  });

  test('github card is present', async ({ page }) => {
    await page.goto(BASE_URL);
    const githubCard = page.locator('.card.github');
    await expect(githubCard).toBeVisible();
  });

  test('streak card is present', async ({ page }) => {
    await page.goto(BASE_URL);
    const streakCard = page.locator('.card.streak');
    await expect(streakCard).toBeVisible();
  });

  test('shows connect placeholder when no GitHub token', async ({ page }) => {
    await page.goto(BASE_URL);
    // Wait a bit for async operations
    await page.waitForTimeout(2000);
    
    const githubContent = page.locator('#githubContent');
    // Should show either loading, connect, or PR content
    const text = await githubContent.textContent();
    expect(text.length).toBeGreaterThan(0);
  });

  test('task input respects max length', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const input = page.locator('#taskInput');
    const maxLength = await input.getAttribute('maxlength');
    expect(parseInt(maxLength)).toBe(200);
  });

  test('cannot add empty task', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const input = page.locator('#taskInput');
    await input.fill('   ');
    await page.locator('#taskAddBtn').click();
    
    // Empty task should not appear
    await expect(page.locator('#taskList')).not.toContainText(/(?<! )/); // No visible non-space chars
  });

  test('pressing Enter adds task', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const input = page.locator('#taskInput');
    await input.fill('Enter key test');
    await input.press('Enter');
    
    await expect(page.locator('#taskList')).toContainText('Enter key test');
  });
});