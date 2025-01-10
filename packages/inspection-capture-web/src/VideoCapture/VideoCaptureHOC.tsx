import { i18nWrap, MonkProvider } from '@monkvision/common';
import { i18nInspectionCaptureWeb } from '../i18n';
import { VideoCapture, VideoCaptureProps } from './VideoCapture';

/**
 * The VideoCapture component is a ready-to-use, single page component that implements a Camera app and lets the user
 * record a video of their vehicle in order to add them to an already created Monk inspection. In order to use this
 * component, you first need to generate an Auth0 authentication token, and create an inspection using the Monk Api.
 * When creating the inspection, don't forget to set the tasks statuses to `NOT_STARTED`. This component will handle the
 * starting of the tasks at the end of the capturing process. You can then pass the inspection ID, the api config (with
 * the auth token) and everything will be handled automatically for you.
 *
 * @example
 * import { VideoCapture } from '@monkvision/inspection-capture-web';
 *
 * export function VideoCaptureScreen({ inspectionId, apiConfig }: VideoCaptureScreenProps) {
 *   const { i18n } = useTranslation();
 *
 *   return (
 *     <VideoCapture
 *       inspectionId={inspectionId}
 *       apiConfig={apiConfig}
 *       onComplete={() => { / * Navigate to another page * / }}
 *       lang={i18n.language}
 *     />
 *   );
 * }
 */
export const VideoCaptureHOC = i18nWrap(function VideoCaptureHOC(props: VideoCaptureProps) {
  return (
    <MonkProvider>
      <VideoCapture {...props} />
    </MonkProvider>
  );
}, i18nInspectionCaptureWeb);
