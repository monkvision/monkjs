import { BasePage } from "../../../shared/pages/BasePage";

export class PhotoCaptureTutorialPage extends BasePage {
  readonly nextButton = this.e2eLocator("photo-tutorial-next");

  /**
   * The tutorial has up to 4 steps: WELCOME, GUIDELINE, SIGHT_TUTORIAL, SIGHT.
   */
  async completeTutorial() {
    while (await this.nextButton.isVisible()) {
      await this.nextButton.click();
      await this.page.waitForTimeout(300);
    }
  }
}
