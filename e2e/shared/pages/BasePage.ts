import type { Page } from "@playwright/test";

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  protected locator(testId: string) {
    return this.page.getByTestId(testId);
  }
  protected e2eLocator(id: string) {
    return this.page.locator(`[data-e2e="${id}"]`);
  }
}
