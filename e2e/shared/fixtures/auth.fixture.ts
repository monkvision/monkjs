import { test as base } from "@playwright/test";
import { buildAuthUrl } from "../utils/token";

export interface AuthFixture {
  authenticatedPage: void;
}

export const test = base.extend<AuthFixture>({
  authenticatedPage: async ({ page, baseURL }, use) => {
    await page.goto(buildAuthUrl(baseURL ?? ""));
    await use();
  },
});
