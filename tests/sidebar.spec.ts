import { PROJECT_NAMES } from "@utils/constants.js";
import { test } from "../fixtures/ui-objects-fixture.js";
import { config } from "../utils/config.js";
import { expect } from "@playwright/test";

test.describe("Test Sidebar", () => {
  test.beforeEach(async ({ page, loginPage, authFlow }) => {
    await loginPage.open();
    await expect(page).toHaveTitle("Report Portal");
    await authFlow.login(config.username, config.password);
    await expect(page).toHaveURL(/.*\/dashboard/);
  });

  test("Check project selection", async ({ page, sidebar }) => {
    await sidebar.selectProject(PROJECT_NAMES[1]);
    await expect(page).toHaveURL(
      new RegExp(`.*/ui/#${PROJECT_NAMES[1]}/dashboard`)
    );
  });

  test("Check dashboard button", async ({ page, sidebar, dashboardPage }) => {
    await sidebar.dashboardsButton.click();
    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(dashboardPage.title).toBeVisible();
  });

  test("Check launches button", async ({ page, sidebar, launchesPage }) => {
    await sidebar.launchesButton.click();
    await expect(page).toHaveURL(/.*\/launches/);
    await expect(launchesPage.launchFilter.open).toBeVisible();
  });

  test("Check filters button", async ({ page, sidebar, filtersPage }) => {
    await sidebar.filtersButton.click();
    await expect(page).toHaveURL(/.*\/filters/);
    await expect(filtersPage.title).toBeVisible();
  });

  test("Check debug button", async ({ page, sidebar, debugPage }) => {
    await sidebar.debugButton.click();
    await expect(page).toHaveURL(/.*\/userdebug/);
    await expect(debugPage.conditions.selector.open).toBeVisible();
  });

  test("Check project members button", async ({
    page,
    sidebar,
    projectMembersPage,
  }) => {
    await sidebar.projectMembersButton.click();
    await expect(page).toHaveURL(/.*\/members/);
    await expect(projectMembersPage.title).toBeVisible();
  });

  test("Check settings button", async ({ page, sidebar, settingsPage }) => {
    await sidebar.settingsButton.click();
    await expect(page).toHaveURL(/.*\/settings/);
    await expect(settingsPage.title).toBeVisible();
  });

  test("Check user button - profile", async ({ sidebar, userProfilePage }) => {
    await sidebar.goToProfile();
    await expect(sidebar.page).toHaveURL(/.*#userProfile/);
    await expect(userProfilePage.title).toBeVisible();
  });

  test("Check user button - API", async ({ sidebar, apiPage }) => {
    await sidebar.goToAPI();
    await expect(sidebar.page).toHaveURL(/.*#api/);
    await expect(apiPage.title).toBeVisible();
  });

  test("Check user button - logout", async ({ sidebar }) => {
    await sidebar.logout();
    await expect(sidebar.page).toHaveURL(/.*#login/);
  });
});
