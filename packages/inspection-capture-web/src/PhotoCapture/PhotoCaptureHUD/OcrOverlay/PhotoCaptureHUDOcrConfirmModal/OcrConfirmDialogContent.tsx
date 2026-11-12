import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { MileageUnit } from '@monkvision/types';
import { styles, SPINNER_KEYFRAMES } from './PhotoCaptureHUDOcrConfirmModal.styles';

export interface OcrConfirmDialogContentProps {
  /** The cropped frame image URI shown at the top of the dialog. */
  imageUri: string;
  /** Text display, input field, spinner, or error message rendered in the content area. */
  displayContent: ReactNode;
  /** Confirm / reject / cancel buttons rendered at the bottom. */
  buttonContent: ReactNode;
  /** When true, renders the mileage unit dropdown next to the content area (odometer mode only). */
  showUnitDropdown: boolean;
  /** Currently selected mileage unit (odometer mode only). */
  selectedUnit?: MileageUnit;
  /** Called when the user picks a different unit from the dropdown. */
  onUnitChange?: (unit: MileageUnit) => void;
}

/** Layout shell for the OCR confirmation dialog: image, content slot, unit dropdown, and buttons. */
export function OcrConfirmDialogContent({
  imageUri,
  displayContent,
  buttonContent,
  showUnitDropdown,
  selectedUnit,
  onUnitChange,
}: OcrConfirmDialogContentProps) {
  const { t } = useTranslation();
  return (
    <div style={styles.dialog}>
      <style>{SPINNER_KEYFRAMES}</style>
      <img src={imageUri} alt={t('photo.hud.ocr.imageAlt')} style={styles.image} />
      <div style={styles.textRow}>
        {displayContent}
        {showUnitDropdown && (
          <select
            style={styles.unitSelect}
            value={selectedUnit ?? MileageUnit.KM}
            onChange={(e) => onUnitChange?.(e.target.value as MileageUnit)}
          >
            <option value={MileageUnit.KM}>{MileageUnit.KM}</option>
            <option value={MileageUnit.MILES}>{MileageUnit.MILES}</option>
          </select>
        )}
      </div>
      <div style={styles.buttons}>{buttonContent}</div>
    </div>
  );
}
