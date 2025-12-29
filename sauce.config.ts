// sauce.config.ts
import { defineConfig } from "@saucelabs/playwright-reporter";

export default defineConfig({
  region: "eu-central-1",
  sauceConnect: false,
  metadata: {
    build: `build-${Date.now()}`,
    name: "Playwright Tests",
    tags: ["playwright", "typescript"],
  },
});
