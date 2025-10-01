import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { SideBar } from "../pages/components/sidebar";
import { DashboardPage } from "../pages/dashboard.page";
import { LaunchesPage } from "../pages/launches.page";
import { FiltersPage } from "../pages/filters.page";
import { DebugPage } from "../pages/debug.page";
import { ProjectMembersPage } from "../pages/members.page";
import { SettingsPage } from "../pages/settings.page";
import { UserProfilePage } from "../pages/profile.page";
import { ApiPage } from "../pages/api.page";
import { AuthFlow } from "flows/auth.flow";

export type UIPages = {
  credentials: { USERNAME: string; PASSWORD: string };
  loginPage: LoginPage;
  sidebar: SideBar;
  dashboardPage: DashboardPage;
  launchesPage: LaunchesPage;
  filtersPage: FiltersPage;
  debugPage: DebugPage;
  projectMembersPage: ProjectMembersPage;
  settingsPage: SettingsPage;
  userProfilePage: UserProfilePage;
  apiPage: ApiPage;
  authFlow: AuthFlow;
};

export const test = base.extend<UIPages>({
  credentials: async ({}, use, testInfo) => {
    await use(testInfo.project.use.credentials);
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  sidebar: async ({ page }, use) => {
    await use(new SideBar(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  launchesPage: async ({ page }, use) => {
    await use(new LaunchesPage(page));
  },
  filtersPage: async ({ page }, use) => {
    await use(new FiltersPage(page));
  },
  debugPage: async ({ page }, use) => {
    await use(new DebugPage(page));
  },
  projectMembersPage: async ({ page }, use) => {
    await use(new ProjectMembersPage(page));
  },
  settingsPage: async ({ page }, use) => {
    await use(new SettingsPage(page));
  },
  userProfilePage: async ({ page }, use) => {
    await use(new UserProfilePage(page));
  },
  apiPage: async ({ page }, use) => {
    await use(new ApiPage(page));
  },
  authFlow: async ({ page }, use) => {
    await use(new AuthFlow(page));
  },
});
