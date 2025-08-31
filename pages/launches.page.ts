import { Locator, Page } from "@playwright/test";

export class LaunchesPage {
  readonly page: Page;
  readonly launchFilter: {
    open: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.launchFilter = {
      open: page.locator('[class*="launchFiltersToolbar"] [class*="arrow"]'),
    };
  }
}
