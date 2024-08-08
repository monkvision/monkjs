import { i18nWrap, MonkProvider } from '@monkvision/common';
import { i18nInspectionCaptureWeb } from '../i18n';
import { PhotoCapture, PhotoCaptureProps } from './PhotoCapture';

/**
 * The PhotoCapture component is a ready-to-use, single page component that implements a Camera app and lets the user
 * take pictures of their vehicle in order to add them to an already created Monk inspection. In order to use this
 * component, you first need to generate an Auth0 authentication token, and create an inspection using the Monk Api.
 * When creating the inspection, don't forget to set the tasks statuses to `NOT_STARTED`. This component will handle the
 * starting of the tasks at the end of the capturing process. You can then pass the inspection ID, the api config (with
 * the auth token), as well as the list of sights to be taken by the user to this component, and everything will be
 * handled automatically for you.
 *
 * @example
 * import { sights } from '@monkvision/sights';
 * import { PhotoCapture } from '@monkvision/inspection-capture-web';
 *
 * const PHOTO_CAPTURE_SIGHTS = [
 *   sights['fesc20-0mJeXBDf'],
 *   sights['fesc20-26n47kaO'],
 *   sights['fesc20-2bLRuhEQ'],
 *   sights['fesc20-4Wqx52oU'],
 *   sights['fesc20-Tlu3sz8A'],
 *   sights['fesc20-5Ts1UkPT'],
 *   sights['fesc20-raHPDUNm'],
 * ];
 *
 * export function PhotoCaptureScreen({ inspectionId, apiConfig }: PhotoCaptureScreenProps) {
 *   const { i18n } = useTranslation();
 *
 *   return (
 *     <PhotoCapture
 *       inspectionId={inspectionId}
 *       apiConfig={apiConfig}
 *       sights={PHOTO_CAPTURE_SIGHTS}
 *       compliances={{ iqa: true }}
 *       onComplete={() => { / * Navigate to another page * / }}
 *       lang={i18n.language}
 *     />
 *   );
 * }
 */
export const PhotoCaptureHOC = i18nWrap(function PhotoCaptureHOC(props: PhotoCaptureProps) {
  return (
    <MonkProvider>
      <PhotoCapture {...props} />
    </MonkProvider>
  );
}, i18nInspectionCaptureWeb);
