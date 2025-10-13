import {
  Before,
  After,
  BeforeAll,
  AfterAll,
  setDefaultTimeout,
} from "@cucumber/cucumber";
import { Browser, BrowserContext, Page, chromium } from "@playwright/test";
import { CustomWorld } from "../support/world";
import dotenv from "dotenv";

setDefaultTimeout(60 * 1000);

let browser: Browser;
let context: BrowserContext;
let page: Page;

BeforeAll(async function () {
  browser = await chromium.launch({
    headless: false,
    timeout: 60000,
  });
  dotenv.config();
});

Before(async function (this: CustomWorld) {
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
  this.browser = browser;
});

After(async function (this: CustomWorld) {
  await this.page?.close();
  await this.context?.close();
});

AfterAll(async function () {
  await browser.close();
});
