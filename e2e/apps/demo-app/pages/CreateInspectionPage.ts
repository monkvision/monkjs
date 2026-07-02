import { BasePage } from "../../../shared/pages/BasePage";

export class CreateInspectionPage extends BasePage {
  /** The app auto-creates an inspection on mount. Wait for navigation away from this page. */
  async waitForInspectionCreated() {
    // MemoryRouter is used, so URL doesn't change. Wait for the vehicle-type confirm button
    // or capture-btn to appear, signaling the inspection was created and the app navigated.
    await this.e2eLocator("vehicle-type-confirm")
      .or(this.locator("capture-btn"))
      .waitFor({ state: "visible", timeout: 30_000 });
  }
}
