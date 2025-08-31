import { Locator, Page } from "@playwright/test";

export class FiltersPage {
  readonly page: Page;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('[title="Filters"]');
  }
}
