import { Locator, Page } from "@playwright/test";

export class SettingsPage {
  readonly page: Page;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator(
      '[class*="navigation__header"]:has-text("Project Settings")'
    );
  }
}
