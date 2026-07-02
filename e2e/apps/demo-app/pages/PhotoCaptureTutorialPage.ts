import { BasePage } from "../../../shared/pages/BasePage";

export class PhotoCaptureTutorialPage extends BasePage {
  readonly nextButton = this.e2eLocator("photo-tutorial-next");

  /**
   * Advances through all tutorial steps until the overlay closes.
   * The tutorial has up to 4 steps: WELCOME, GUIDELINE, SIGHT_TUTORIAL, SIGHT.
   * All are enabled in the local-config (enableSightGuidelines + enableSightTutorial).
   */
  async completeTutorial() {
    while (await this.nextButton.isVisible()) {
      await this.nextButton.click();
      await this.page.waitForTimeout(300);
    }
  }
}
