import { MonkApiConfig } from '@monkvision/network';
import { useState } from 'react';
import { VehicleType } from '@monkvision/types';
import { styles } from './DamageDisclosure.styles';
import { DamageDisclosureHomeView } from './DamageDisclosureHomeView';
import { useI18nSync } from '@monkvision/common';

/**
 * Props accepted by the DamageDisclosure component.
 */
export interface DamageDisclosureProps {
  /**
   * The api config used to communicate with the API. Make sure that the user described in the auth token is the same
   * one as the one that created the inspection provided in the `inspectionId` prop.
   */
  apiConfig: MonkApiConfig;
  /**
   * The ID of the inspection to add images to. Make sure that the user that created the inspection if the same one as
   * the one described in the auth token in the `apiConfig` prop.
   */
  inspectionId: string;
  /**
   * The type of the user's vehicle used to display the proper veichle wireframes.
   *
   * @default VehicleType.CUV
   */
  vehicleType?: VehicleType;
  /**
   * Callback called when the user has completed the damage disclosure and this screen can be closed.
   */
  onComplete?: () => void;
  /**
   * The language to be used by this component.
   *
   * @default en
   */
  lang?: string | null;
}

enum DamageDisclosureView {
  HOME = 'home',
}

// No ts-doc for this component : the component exported is DamageDisclosureHOC
export function DamageDisclosure({
  apiConfig,
  inspectionId,
  vehicleType = VehicleType.CUV,
  onComplete,
  lang,
}: DamageDisclosureProps) {
  useI18nSync(lang);
  const [view, setView] = useState(DamageDisclosureView.HOME);

  return (
    <div style={styles['container']}>
      {view === DamageDisclosureView.HOME && <DamageDisclosureHomeView onComplete={onComplete} />}
    </div>
  );
}
