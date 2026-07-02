import { BasePage } from "../../../shared/pages/BasePage";

export class DamageReportPage extends BasePage {
  async waitFor(timeout = 15_000) {
    await this.page.waitForURL("**c=e5j**", { timeout });
  }
}
