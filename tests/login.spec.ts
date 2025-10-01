import { test } from "../fixtures/ui-objects-fixture.js";
import { expect } from "@playwright/test";

test.describe("Test Login page", () => {
  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.open();
    await expect(page).toHaveTitle("Report Portal");
  });

  test("Check successful login", async ({
    page,
    credentials,
    loginPage,
    authFlow,
  }) => {
    await authFlow.login(credentials.USERNAME, credentials.PASSWORD);
    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(loginPage.successfulLoginNotification).toBeVisible();
  });

  test("Check login with empty username", async ({ loginPage, authFlow }) => {
    await authFlow.login("", "");
    await expect(loginPage.warnings.loginEmpty).toBeVisible();
  });

  test("Check login with wrong credentials", async ({
    loginPage,
    authFlow,
  }) => {
    await authFlow.login("wrong", "wrong");
    await expect(loginPage.warnings.loginBadCredentials).toBeVisible();
    await expect(loginPage.warnings.passwordBadCredentials).toBeVisible();
    await expect(loginPage.permissionErrorNotification).toBeVisible();
  });
});
