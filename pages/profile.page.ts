import { Locator, Page } from "@playwright/test";

export class UserProfilePage {
  readonly page: Page;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('[title="User profile"]');
  }
}
