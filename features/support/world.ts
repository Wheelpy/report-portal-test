import { setWorldConstructor, World, IWorldOptions } from "@cucumber/cucumber";
import { BrowserContext, Page, Browser } from "@playwright/test";

export class CustomWorld extends World {
  context?: BrowserContext;
  page?: Page;
  browser?: Browser;
  storedValues!: { [key: string]: any };

  constructor(options: IWorldOptions) {
    super(options);
    this.storedValues = {};
  }
}

setWorldConstructor(CustomWorld);
