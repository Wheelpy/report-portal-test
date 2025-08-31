import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/login.page";

export type UIPages = {
  loginPage: LoginPage;
};

export const test = base.extend<UIPages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});
