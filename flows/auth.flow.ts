import { Page } from "@playwright/test";
import { LoginPage } from "../pages/login.page.js";

export class AuthFlow {
  private page: Page;
  private loginPage: LoginPage;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
  }

  async login(username: string, password: string) {
    await this.loginPage.open();
    await this.loginPage.login(username, password);
  }

  async logout(sidebar: { logout: () => Promise<void> }) {
    await sidebar.logout();
  }
}
