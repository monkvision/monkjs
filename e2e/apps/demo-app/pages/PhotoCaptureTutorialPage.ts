import { BasePage } from "../../../shared/pages/BasePage";

export class PhotoCaptureTutorialPage extends BasePage {
  readonly nextButton = this.e2eLocator("photo-tutorial-next");

  async completeTutorial() {
    while (await this.nextButton.isVisible()) {
      await this.nextButton.click();
      await this.page.waitForTimeout(300);
    }
  }
}
