import { CSSProperties } from 'react';
import { styles } from './PhotoCaptureHUDElementsAddDamagePartSelectShot.styles';

interface PhotoCaptureHUDElementsAddDamagePartSelectShotStyle {
  popup: CSSProperties;
  vehicleSelect: CSSProperties;
  closeBtn: CSSProperties;
  labelsContainer: CSSProperties;
  partsLabel: CSSProperties;
  tutoLabel: CSSProperties;
  validateBtn: CSSProperties;
}

// eslint-disable-next-line max-len
export function usePhotoCaptureHUDElementsAddDamagePartSelectShotStyle(): PhotoCaptureHUDElementsAddDamagePartSelectShotStyle {
  return {
    popup: {
      ...styles['popup'],
    },
    vehicleSelect: { ...styles['vehicleSelect'] },
    closeBtn: {
      ...styles['closeBtn'],
    },
    labelsContainer: {
      ...styles['labelsContainer'],
    },
    partsLabel: {
      ...styles['partsLabel'],
    },
    tutoLabel: {
      ...styles['tutoLabel'],
    },
    validateBtn: {
      ...styles['validateBtn'],
    },
  };
}
