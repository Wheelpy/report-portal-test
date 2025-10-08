import { test } from "../fixtures/ui-objects-fixture.js";
import { expect } from "@playwright/test";

test.describe("Test Launches page", () => {
  test.beforeEach(
    async ({
      page,
      credentials,
      loginPage,
      authFlow,
      sidebar,
      launchesPage,
    }) => {
      await loginPage.open();
      await expect(page).toHaveTitle("Report Portal");
      await authFlow.login(credentials.USERNAME, credentials.PASSWORD);
      await expect(page).toHaveURL(/.*\/dashboard/);
      await sidebar.launchesButton.click();
      await expect(page).toHaveURL(/.*\/launches/);
      await expect(launchesPage.launchFilter.open).toBeVisible();
    }
  );

  test("Check user is able to select several launches and compare the", async ({
    launchesPage,
  }) => {
    await launchesPage.selectLaunchByNumber(0);
    await launchesPage.selectLaunchByNumber(1);
    await launchesPage.openActions();
    await launchesPage.selectCompare();
    await expect(launchesPage.compareLaunchesWindow.title).toBeVisible();
    await expect(launchesPage.compareLaunchesWindow.launchGraph).toHaveCount(2);
  });

  test("Check User is able to remove launch", async ({ launchesPage }) => {
    const nameInfo = await launchesPage.launchRow.nameInfo(0);
    await expect(launchesPage.launchRow.nameInfo(0)).toBeVisible();
    const launchNameInitial = await nameInfo.textContent();

    await launchesPage.selectLaunchByNumber(0);
    await launchesPage.openActions();
    await launchesPage.selectDelete();
    await launchesPage.confirmDelete();
    await expect(launchesPage.notifications.launchDeleted).toBeVisible();
    await expect(launchesPage.notifications.launchDeleted).not.toBeVisible({
      timeout: 10000,
    });

    await expect(launchesPage.launchRow.nameInfo(0)).toBeVisible();
    const launchNameUpdated = await nameInfo.textContent();

    expect(launchNameInitial).not.toBe(launchNameUpdated);
  });

  test("Check user is able to move to appropriate launch view clicking on Launch name", async ({
    page,
    launchesPage,
  }) => {
    await launchesPage.launchRow.nameInfo(0).click();
    await expect(page).toHaveURL(/.*\/launches\/all\//);
  });
});
