import { Page, Locator } from "@playwright/test";

export class LoginPage {
  private page: Page;
  private loginInput: Locator;
  private passwordInput: Locator;
  private loginButton: Locator;
  public warnings: {
    loginEmpty: Locator;
    passwordEmpty: Locator;
    loginBadCredentials: Locator;
    passwordBadCredentials: Locator;
  };
  public successfulLoginNotification: Locator;
  public permissionErrorNotification: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginInput = page.locator('input[name="login"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.warnings = {
      loginEmpty: this.loginInput
        .locator("../..")
        .locator(
          'span:has-text("User name may contain only Latin, numeric characters, hyphen, underscore, dot (from 1 to 128 symbols)")'
        ),
      loginBadCredentials: this.loginInput
        .locator("../..")
        .locator('span:has-text("Bad credentials")'),
      passwordEmpty: this.passwordInput
        .locator("../..")
        .locator(
          'span:has-text("Password should contain at least 4 characters; a special symbol; upper-case (A - Z); lower-case")'
        ),
      passwordBadCredentials: this.passwordInput
        .locator("../..")
        .locator('span:has-text("Bad credentials")'),
    };
    this.successfulLoginNotification = page.locator(
      '[data-automation-id="notificationsContainer"]:has-text("Signed in successfully")'
    );
    this.permissionErrorNotification = this.page.locator(
      '[data-automation-id="notificationsContainer"]:has-text("An error occurred while connecting to server: You do not have enough permissions. Bad credentials")'
    );
  }

  async open() {
    await this.page.goto("/");
  }

  async login(username: string, password: string) {
    await this.loginInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
