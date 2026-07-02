import { BasePage } from "../../../shared/pages/BasePage";

export class PermissionsPage extends BasePage {
  readonly confirmButton = this.e2eLocator("permissions-confirm");

  async grantPermissions() {
    await this.confirmButton.waitFor({ state: "visible", timeout: 15_000 });
    await this.confirmButton.click();
  }
}
