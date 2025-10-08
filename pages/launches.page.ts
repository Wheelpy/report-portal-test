import { Locator, Page } from "@playwright/test";

export class LaunchesPage {
  readonly page: Page;
  readonly launchFilter: {
    open: Locator;
  };
  readonly actions: {
    open: Locator;
    selectCompare: Locator;
    selectDelete: Locator;
  };
  readonly launchRow: {
    select: Locator;
    nameInfo: (nameNumber: number) => Locator;
    defectStatistics: (
      rowNumber: number,
      statisticsElementNumber: number
    ) => Locator;
  };
  readonly compareLaunchesWindow: {
    title: Locator;
    launchGraph: Locator;
  };
  readonly deleteLaunchWindow: {
    deleteButton: Locator;
  };
  readonly notifications: {
    launchDeleted: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.launchFilter = {
      open: page.locator('[class*="launchFiltersToolbar"] [class*="arrow"]'),
    };
    this.actions = {
      open: page.locator(
        '[class*="ghostMenuButton"]:has-text("Actions") [class*="ghostMenuButton__toggle-icon"]'
      ),
      selectCompare: page.locator(
        '[class*="ghostMenuButton__menu-item"]:has-text("Compare")'
      ),
      selectDelete: page.locator(
        '[class*="ghostMenuButton__menu-item"]:has-text("Delete")'
      ),
    };
    this.launchRow = {
      select: page.locator(`[data-id] div[class*="checkIcon"]`),
      nameInfo: (nameNumber) =>
        page
          .locator(
            `[data-id] [class*="itemInfo__edit-number-box"] a[class*="itemInfo__name-link"]`
          )
          .nth(nameNumber),
      defectStatistics: (rowNumber, statisticsElementNumber) =>
        page.locator(
          `[data-id]:nth-child(${rowNumber}) [class*="defectStatistics__defect-statistics"] [class*="tooltip"]:nth-child(${statisticsElementNumber})`
        ),
    };
    this.compareLaunchesWindow = {
      title: page.locator(
        '[class*="modalHeader__modal-title"]:has-text("Compare launches")'
      ),
      launchGraph: page.locator('g[class="tick"] tspan[x="0"]'),
    };
    this.deleteLaunchWindow = {
      deleteButton: page.locator(
        '[class*="bigButton__color-tomato"]:has-text("Delete")'
      ),
    };
    this.notifications = {
      launchDeleted: page.locator(
        '[data-automation-id="notificationItem"]:has-text("Launch was deleted")'
      ),
    };
  }

  async selectLaunchByNumber(number: number) {
    await this.launchRow.select.nth(number).click();
  }

  async openActions() {
    await this.actions.open.click();
  }

  async selectCompare() {
    await this.actions.selectCompare.click();
  }

  async selectDelete() {
    await this.actions.selectDelete.click();
  }

  async confirmDelete() {
    await this.deleteLaunchWindow.deleteButton.click();
  }

  async goToDefectStatistics(
    rowNumber: number,
    statisticsElementNumber: number
  ) {
    await this.launchRow
      .defectStatistics(rowNumber, statisticsElementNumber)
      .click();
  }
}
