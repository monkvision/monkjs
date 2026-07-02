import { BasePage } from "../../../shared/pages/BasePage";

export class CreateInspectionPage extends BasePage {
  /** The app auto-creates an inspection on mount. Wait for navigation away from this page. */
  async waitForInspectionCreated() {
    await this.e2eLocator("vehicle-type-confirm")
      .or(this.locator("capture-btn"))
      .waitFor({ state: "visible", timeout: 30_000 });
  }
}
