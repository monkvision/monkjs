import { useTranslation } from 'react-i18next';
import { Button } from '@monkvision/common-ui-web';
import { styles } from './PhotoCaptureHUDOcrConfirmModal.styles';

export interface OcrButtonsProps {
  /** When true, renders only the Close button for the invalid-reading error state. */
  isInvalidReading: boolean;
  /** When true, renders only the Continue button for the OCR-failure error state. */
  ocrFailed: boolean;
  /** When true, renders Cancel + Confirm buttons for manual-input editing mode. */
  isEditing: boolean;
  /** When true, the Confirm button is disabled (no text yet or still loading). */
  confirmDisabled: boolean;
  /** Called when the user confirms the displayed text. */
  onConfirm: () => void;
  /** Called when the user rejects the displayed text. */
  onReject: () => void;
  /** Called when the user cancels manual editing and returns to scanning. */
  onEditCancel?: () => void;
  /** Called when the user closes the invalid-reading message. */
  onInvalidReading?: () => void;
  /** Called when the user dismisses the OCR-failure message. */
  onOcrFailed?: () => void;
}

/** Action buttons for the OCR confirmation dialog, adapting to the current dialog state. */
export const OcrButtons = ({
  isInvalidReading,
  ocrFailed,
  isEditing,
  confirmDisabled,
  onConfirm,
  onReject,
  onEditCancel,
  onInvalidReading,
  onOcrFailed,
}: OcrButtonsProps) => {
  const { t } = useTranslation();
  if (isInvalidReading) {
    return (
      <Button
        variant='outline'
        primaryColor='alert-light'
        secondaryColor='background-dark'
        style={styles.button}
        onClick={onInvalidReading}
      >
        {t('photo.hud.ocr.close')}
      </Button>
    );
  }
  if (ocrFailed) {
    return (
      <Button
        variant='outline'
        primaryColor='primary-xlight'
        secondaryColor='background-dark'
        style={styles.button}
        onClick={onOcrFailed}
      >
        {t('photo.hud.ocr.continue')}
      </Button>
    );
  }
  if (isEditing) {
    return (
      <>
        <Button
          variant='outline'
          primaryColor='alert-light'
          secondaryColor='background-dark'
          style={styles.button}
          onClick={onEditCancel}
        >
          {t('photo.hud.ocr.cancel')}
        </Button>
        <Button
          variant='outline'
          primaryColor='primary-xlight'
          secondaryColor='background-dark'
          style={styles.button}
          disabled={confirmDisabled}
          onClick={onConfirm}
        >
          {t('photo.hud.ocr.confirm')}
        </Button>
      </>
    );
  }
  return (
    <>
      <Button
        variant='outline'
        primaryColor='alert-light'
        secondaryColor='background-dark'
        style={styles.button}
        onClick={onReject}
      >
        {t('photo.hud.ocr.no')}
      </Button>
      <Button
        variant='outline'
        primaryColor='primary-xlight'
        secondaryColor='background-dark'
        style={styles.button}
        disabled={confirmDisabled}
        onClick={onConfirm}
      >
        {t('photo.hud.ocr.yes')}
      </Button>
    </>
  );
};
