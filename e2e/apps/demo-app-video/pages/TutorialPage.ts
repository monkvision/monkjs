import { BasePage } from "../../../shared/pages/BasePage";

const TUTORIAL_STEP_COUNT = 5;

export class TutorialPage extends BasePage {
  readonly continueButton = this.e2eLocator("tutorial-continue");

  async completeTutorial() {
    for (let step = 0; step < TUTORIAL_STEP_COUNT; step++) {
      await this.continueButton.waitFor({ state: "visible", timeout: 15_000 });
      await this.page.waitForSelector(
        '[data-e2e="tutorial-continue"]:not([disabled])'
      );
      await this.continueButton.click();
    }
  }
}
