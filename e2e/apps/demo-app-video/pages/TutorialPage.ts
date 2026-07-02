import { BasePage } from "../../../shared/pages/BasePage";

export class TutorialPage extends BasePage {
  readonly continueButton = this.e2eLocator("tutorial-continue");

  async completeTutorial() {
    await this.continueButton.waitFor({ state: "visible", timeout: 15_000 });
    while (await this.continueButton.isVisible()) {
      await this.page.waitForSelector(
        '[data-e2e="tutorial-continue"]:not([disabled])'
      );
      await this.continueButton.click();
      await this.page.waitForTimeout(300);
    }
  }
}
