import { Locator, Page } from "@playwright/test";

export class ProjectMembersPage {
  readonly page: Page;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('[title]:has-text("Project members")'); //bug found: in DOM, title attribute has value [object Object]
  }
}
