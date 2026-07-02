import { test as base } from "@playwright/test";
import { buildAuthUrl, AuthUrlOptions } from "../utils/token";

export interface AuthFixture {
  authenticatedPage: { baseUrl: string };
}

export const test = base.extend<AuthFixture>({
  authenticatedPage: async ({ page, baseURL }, use) => {
    const url = buildAuthUrl(baseURL ?? "");
    await page.goto(url);
    await use({ baseUrl: baseURL ?? "" });
  },
});

export { expect } from "@playwright/test";
export type { AuthUrlOptions };
