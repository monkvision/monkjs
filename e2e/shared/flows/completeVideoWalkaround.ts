import type { PermissionsPage } from "../../apps/demo-app-video/pages/PermissionsPage";
import type { TutorialPage } from "../../apps/demo-app-video/pages/TutorialPage";
import type { VideoCapturePage } from "../../apps/demo-app-video/pages/VideoCapturePage";
import type { VideoCaptureCompletePage } from "../../apps/demo-app-video/pages/VideoCaptureCompletePage";

export interface CompleteVideoWalkaroundFlowArgs {
  permissionsPage: PermissionsPage;
  tutorialPage: TutorialPage;
  videoCapturePage: VideoCapturePage;
  videoCaptureCompletePage: VideoCaptureCompletePage;
}

export async function completeVideoWalkaround({
  permissionsPage,
  tutorialPage,
  videoCapturePage,
  videoCaptureCompletePage,
}: CompleteVideoWalkaroundFlowArgs): Promise<void> {
  await permissionsPage.grantPermissions();
  await tutorialPage.completeTutorial();
  await videoCapturePage.recordWalkaround();
  await videoCaptureCompletePage.confirmAndProceedToPhotoCapture();
}
