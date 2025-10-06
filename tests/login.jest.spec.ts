import { Browser, Page, chromium } from "playwright";
import {
  expect,
  test,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
  describe,
} from "@jest/globals";

describe("Test login page", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch({ headless: true });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    const context = await browser.newContext();
    page = await context.newPage();
    await page.goto("https://rp.epam.com/");
    const title = await page.title();
    expect(title).toBe("Report Portal");
  });

  afterEach(async () => {
    await page.close();
  });

  test("Check successful login", async () => {
    await page.fill('input[name="login"]', global.credentials.USERNAME || "");
    await page.fill(
      'input[name="password"]',
      global.credentials.PASSWORD || ""
    );
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*\/dashboard/);
    expect(page.url()).toMatch(/.*\/dashboard/);
    await page.waitForSelector(
      '[data-automation-id="notificationsContainer"]:has-text("Signed in successfully")'
    );
  });
});
