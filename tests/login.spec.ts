import { test } from "../fixtures/ui-objects-fixture.js";
import { config } from "../utils/config.js";

test.describe("Test Report Portal", () => {
  test("Check Login page", async ({ loginPage }) => {
    await loginPage.open();
  });
});
