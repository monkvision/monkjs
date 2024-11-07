import { i18nWrap, MonkProvider } from '@monkvision/common';
import { DamageDisclosure, DamageDisclosureProps } from './DamageDisclosure';
import { i18nInspectionCaptureWeb } from '../i18n';

/**
 * The DamageDisclosure component is a ready-to-use, single page component that allows the user to manually disclose
 * damages on their vehicle before or after performing an inspection. In order to use this component, you first need to
 * generate an Auth0 authentication token, and create an inspection using the Monk Api.
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
