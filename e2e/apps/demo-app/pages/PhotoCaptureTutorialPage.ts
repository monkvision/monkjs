import { MonkE2eId } from "@monkvision/types";
import { BasePage } from "../../../shared/pages/BasePage";

export class PhotoCaptureTutorialPage extends BasePage {
  readonly nextButton = this.e2eLocator(MonkE2eId.PHOTO_TUTORIAL_NEXT);

  async completeTutorial() {
    while (await this.nextButton.isVisible()) {
      await this.nextButton.click();
      await this.page.waitForTimeout(300);
    }
  }
}
