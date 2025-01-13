import { i18nWrap, MonkProvider } from '@monkvision/common';
import { i18nInspectionCaptureWeb } from '../i18n';
import { DamageDisclosure, DamageDisclosureProps } from './DamageDisclosure';

/**
 * The DamageDisclosure component is a ready-to-use, single page component that implements a Camera app, allowing users
 * to capture photos of damaged parts of their vehicle for the purpose of disclosing damage. In order to use this
 * component, you first need to generate an Auth0 authentication token, and create an inspection using the Monk Api.
 * When creating the inspection, don't forget to set the tasks statuses to `NOT_STARTED`. You can then pass the
 * inspection ID, the api config (with the auth token) and everything will be handled automatically for you.
 *
 * @example
 * import { DamageDisclosure } from '@monkvision/inspection-capture-web';
 *
 * export function PhotoCaptureScreen({ inspectionId, apiConfig }: PhotoCaptureScreenProps) {
 *   const { i18n } = useTranslation();
 *
 *   return (
 *     <DamageDisclosure
 *       inspectionId={inspectionId}
 *       apiConfig={apiConfig}
 *       compliances={{ iqa: true }}
 *       onComplete={() => { / * Navigate to another page * / }}
 *       lang={i18n.language}
 *     />
 *   );
 * }
 */
export const DamageDisclosureHOC = i18nWrap(function DamageDisclosureHOC(
  props: DamageDisclosureProps,
) {
  return (
    <MonkProvider>
      <DamageDisclosure {...props} />
    </MonkProvider>
  );
},
i18nInspectionCaptureWeb);
