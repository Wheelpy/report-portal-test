import { Given, When, Then } from "@cucumber/cucumber";
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

// Given("I am on the login page", async function (this: CustomWorld) {
//   await this.page!.goto("https://reportportal.epam.com/");
//   await expect(this.page!).toHaveTitle("Report Portal");
// });

// When(
//   "I enter username {string} and password {string}",
//   async function (this: CustomWorld, username: string, password: string) {
//     await this.page!.fill("#username", username);
//     await this.page!.fill("#password", password);
//   }
// );

// When("I click the login button", async function (this: CustomWorld) {
//   await this.page!.click('button[type="submit"]');
// });

// Then(
//   "I should be redirected to the dashboard",
//   async function (this: CustomWorld) {
//     await this.page!.waitForURL("**/dashboard");
//     expect(this.page!.url()).toContain("/dashboard");
//   }
// );

// Then("I should see welcome message", async function (this: CustomWorld) {
//   const welcomeMessage = this.page!.locator(".welcome-message");
//   await expect(welcomeMessage).toBeVisible();
// });

// Then(
//   "I should see error message {string}",
//   async function (this: CustomWorld, errorMessage: string) {
//     const errorElement = this.page!.locator(".error-message");
//     await expect(errorElement).toHaveText(errorMessage);
//   }
// );
