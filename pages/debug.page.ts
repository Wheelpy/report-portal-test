import { Locator, Page } from "@playwright/test";

export class DebugPage {
  readonly page: Page;
  readonly conditions: {
    selector: {
      open: Locator;
    };
  };

  constructor(page: Page) {
    this.page = page;
    this.conditions = {
      selector: {
        open: page.locator(
          '[class*="refineFilters"] [class*="conditions-selector"]'
        ),
      },
    };
  }
}
