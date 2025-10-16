import { Given } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/world";
import { LoginPage } from "@pages/login.page";
import { LaunchesPage } from "@pages/launches.page";
import { SideBar } from "@pages/components/sidebar";

Given("I visit Report Portal", async function (this: CustomWorld) {
  await this.page!.goto("https://reportportal.epam.com/");
  await expect(this.page!).toHaveTitle("Report Portal");
});

Given("I log in", async function (this: CustomWorld) {
  const username = process.env.RP_USER_PROD || "default_username";
  const password = process.env.RP_PASSWORD_PROD || "default_password";

  const loginPage = new LoginPage(this.page!);
  await loginPage.login(username, password);
  await expect(this.page!).toHaveURL(/.*\/dashboard/);
});

Given("I go to Launches page", async function (this: CustomWorld) {
  const launchesPage = new LaunchesPage(this.page!);
  const sidebar = new SideBar(this.page!);

  await sidebar.launchesButton.click();
  await expect(this.page!).toHaveURL(/.*\/launches/);
  await expect(launchesPage.launchFilter.open).toBeVisible();
});
