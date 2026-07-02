import type { PhotoCapturePage } from "../pages/PhotoCapturePage";
import type { PhotoCaptureTutorialPage } from "../../apps/demo-app/pages/PhotoCaptureTutorialPage";
import type { TutorialPage } from "../../apps/demo-app-video/pages/TutorialPage";

export interface CompletePhotoCaptureJourneyOptions {
  tutorialPage?: PhotoCaptureTutorialPage | TutorialPage;
}

export async function completePhotoCaptureJourney(
  photoCapturePage: PhotoCapturePage,
  options: CompletePhotoCaptureJourneyOptions = {},
): Promise<void> {
  if (options.tutorialPage) {
    await options.tutorialPage.completeTutorial();
  }
  await photoCapturePage.captureAllSights();
}
