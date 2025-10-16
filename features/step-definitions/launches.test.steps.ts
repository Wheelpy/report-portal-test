import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/world";
import { LaunchesPage } from "@pages/launches.page";

When("User selects several launches", async function (this: CustomWorld) {
  const launchesPage = new LaunchesPage(this.page!);

  await launchesPage.selectLaunchByNumber(0);
  await launchesPage.selectLaunchByNumber(1);
});

When("Compare selected launches", async function (this: CustomWorld) {
  const launchesPage = new LaunchesPage(this.page!);
  await launchesPage.openActions();
  await launchesPage.selectCompare();
});

Then(
  "Launches comparison graph is visible",
  async function (this: CustomWorld) {
    const launchesPage = new LaunchesPage(this.page!);
    await expect(launchesPage.compareLaunchesWindow.title).toBeVisible();
    await expect(launchesPage.compareLaunchesWindow.launchGraph).toHaveCount(2);
  }
);

When("User select a launch", async function (this: CustomWorld) {
  const launchesPage = new LaunchesPage(this.page!);

  const nameInfo = await launchesPage.launchRow.nameInfo(0);
  await expect(launchesPage.launchRow.nameInfo(0)).toBeVisible();

  this.storedValues = {
    launchNameInitial: "",
    launchNameUpdated: "",
  };

  this.storedValues.launchNameInitial = await nameInfo.textContent();
});

When("Removes selected launch", async function (this: CustomWorld) {
  const launchesPage = new LaunchesPage(this.page!);
  await launchesPage.selectLaunchByNumber(0);
  await launchesPage.openActions();
  await launchesPage.selectDelete();
  await launchesPage.confirmDelete();

  await expect(launchesPage.notifications.launchDeleted).toBeVisible({
    timeout: 50000,
  });
  await expect(launchesPage.notifications.launchDeleted).not.toBeVisible({
    timeout: 10000,
  });
});

Then(
  "Selected launch is removed from the list",
  async function (this: CustomWorld) {
    const launchesPage = new LaunchesPage(this.page!);
    const nameInfo = await launchesPage.launchRow.nameInfo(0);
    await expect(launchesPage.launchRow.nameInfo(0)).toBeVisible();

    this.storedValues.launchNameUpdated = await nameInfo.textContent();
    expect(this.storedValues.launchNameInitial).not.toBe(
      this.storedValues.launchNameUpdated
    );
  }
);

When(
  "User clicks on the {string}",
  async function (this: CustomWorld, launchGridElement: string) {
    const launchesPage = new LaunchesPage(this.page!);

    switch (launchGridElement) {
      case "launch name":
        await launchesPage.launchRow.nameInfo(0).click();
        break;

      case "total":
        await launchesPage.launchRow.totalTests(0).click();
        break;

      case "passed":
        await launchesPage.launchRow.passedTests(0).click();
        break;
    }
  }
);

Then(
  "User is navigated to {string}",
  async function (this: CustomWorld, launchViewPage: string) {
    const currentUrl = await this.page!.url();

    switch (launchViewPage) {
      case "all launches":
        await expect(this.page!).toHaveURL(/.*\/launches\/all\//);
        break;

      case "total tests":
        const testTypesFilter = currentUrl.split("filter.in.status")[1];
        if (testTypesFilter) {
          const cleanedFilter = testTypesFilter.replace(/[^a-zA-Z]/g, "");
          await expect(cleanedFilter).toContain(
            "DPASSEDCFAILEDCSKIPPEDCINTERRUPTED"
          );
        }
        break;

      case "passed tests":
        const testTypesFilterPassed = currentUrl.split("filter.in.status")[1];
        if (testTypesFilterPassed) {
          const cleanedFilter = testTypesFilterPassed.replace(/[^a-zA-Z]/g, "");
          await expect(cleanedFilter).toBe("DPASSED");
        }
        break;
    }
  }
);
