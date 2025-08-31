import { Page, Locator } from "@playwright/test";

export class SideBar {
  readonly page: Page;
  readonly projectSelector: {
    open: Locator;
    selectProject: (projectName: string) => Locator;
  };
  readonly dashboardsButton: Locator;
  readonly launchesButton: Locator;
  readonly filtersButton: Locator;
  readonly debugButton: Locator;
  readonly projectMembersButton: Locator;
  readonly settingsButton: Locator;
  readonly userBlock: {
    open: Locator;
    profile: Locator;
    api: Locator;
    logout: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.projectSelector = {
      open: page.locator(
        '[class*="sidebar__main"] [class*="project-selector"]'
      ),
      selectProject: (projectName: string) =>
        page.locator(
          `[class*="sidebar__main"] [class*="project-list-item"][href="#${projectName}"]`
        ),
    };
    this.dashboardsButton = page.locator(
      '[class*="sidebar"][href*="dashboard"]'
    );
    this.launchesButton = page.locator('[class*="sidebar"][href*="launches"]');
    this.filtersButton = page.locator('[class*="sidebar"][href*="filters"]');
    this.debugButton = page.locator('[class*="sidebar"][href*="debug"]');
    this.projectMembersButton = page.locator(
      '[class*="sidebar"][href*="members"]'
    );
    this.settingsButton = page.locator('[class*="sidebar"][href*="settings"]');
    this.userBlock = {
      open: page.locator('[class*="user-block"]'),
      profile: page.locator('[class*="menu-item"][href="#userProfile"]'),
      api: page.locator('[class*="menu-item"][href="#api"]'),
      logout: page.locator('[class*="menu-item"]:has-text("Logout")'),
    };
  }

  async selectProject(projectName: string) {
    await this.projectSelector.open.click();
    await this.projectSelector.selectProject(projectName).click();
  }

  async goToProfile() {
    await this.userBlock.open.click();
    await this.userBlock.profile.click();
  }

  async goToAPI() {
    await this.userBlock.open.click();
    await this.userBlock.api.click();
  }

  async logout() {
    await this.userBlock.open.click();
    await this.userBlock.logout.click();
  }
}
