import { MonkE2eId, MonkTestId } from "@monkvision/types";
import { BasePage } from "../../../shared/pages/BasePage";

export class CreateInspectionPage extends BasePage {
  /** The app auto-creates an inspection on mount. Wait for navigation away from this page. */
  async waitForInspectionCreated() {
    await this.e2eLocator(MonkE2eId.VEHICLE_TYPE_CONFIRM)
      .or(this.locator(MonkTestId.CAPTURE_BTN))
      .waitFor({ state: "visible", timeout: 30_000 });
  }
}
