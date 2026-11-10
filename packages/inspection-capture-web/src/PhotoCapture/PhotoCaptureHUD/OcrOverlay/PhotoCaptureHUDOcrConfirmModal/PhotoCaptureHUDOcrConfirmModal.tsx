import React, { useEffect, useRef } from 'react';
import { BackdropDialog, Button } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { MileageUnit, OcrMode } from '@monkvision/types';
import { styles } from './PhotoCaptureHUDOcrConfirmModal.styles';
import { OcrConfirmDialogContent } from './OcrConfirmDialogContent';
import { OcrDisplay } from './OcrDisplay';

interface OcrButtonsProps {
  isInvalidReading: boolean;
  ocrFailed: boolean;
  isEditing: boolean;
  confirmDisabled: boolean;
  onConfirm: () => void;
  onReject: () => void;
  onEditCancel?: () => void;
  onInvalidReading?: () => void;
  onOcrFailed?: () => void;
}

function OcrButtons({
  isInvalidReading,
  ocrFailed,
  isEditing,
  confirmDisabled,
  onConfirm,
  onReject,
  onEditCancel,
  onInvalidReading,
  onOcrFailed,
}: OcrButtonsProps) {
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
}

export interface PhotoCaptureHUDOcrConfirmModalProps {
  /** The confirmed text to display below the image. */
  text: string;
  /** The cropped frame image as a data URL. */
  imageUri: string;
  /** Called when the user confirms the detected text (or the manually edited text). */
  onConfirm: () => void;
  /** Called when the user rejects the detected text (triggers re-scan or edit). */
  onReject: () => void;
  /**
   * When true, the modal switches to an editable text input so the user can correct
   * the OCR reading manually before confirming.
   */
  isEditing?: boolean;
  /** Current value of the manual input field (controlled). */
  editValue?: string;
  /** Called on every keystroke in the manual input field. */
  onEditChange?: (value: string) => void;
  /** Called when the user cancels manual entry and goes back to OCR scanning. */
  onEditCancel?: () => void;
  /** OCR mode — determines the keyboard type and character filter for the input. */
  mode?: OcrMode;
  /** Currently selected mileage unit (odometer mode only). */
  selectedUnit?: MileageUnit;
  /** Called when the user picks a different unit from the dropdown (odometer mode only). */
  onUnitChange?: (unit: MileageUnit) => void;
  /** When true, shows a loading spinner while OCR processes the fallback image. */
  isOcrLoading?: boolean;
  /** When true, OCR failed to detect any text — shows an error message with a dismiss button. */
  ocrFailed?: boolean;
  /** Called when the user dismisses the OCR failure message. */
  onOcrFailed?: () => void;
  /** When true, the detected value is out of the valid range — shows an error with a Close button. */
  isInvalidReading?: boolean;
  /** Called when the user closes the invalid reading message to go back to scanning. */
  onInvalidReading?: () => void;
}

/**
 * Modal dialog shown when OCR confirms a reading (or when the fallback picture is taken).
 * Displays the cropped image alongside the detected text and offers Confirm / No buttons.
 * Switches to an editable input when `isEditing` is true, and shows error states for invalid
 * readings and OCR failures.
 */
export function PhotoCaptureHUDOcrConfirmModal({
  text,
  imageUri,
  onConfirm,
  onReject,
  isEditing = false,
  editValue = '',
  onEditChange,
  onEditCancel,
  mode,
  selectedUnit,
  onUnitChange,
  isOcrLoading = false,
  ocrFailed = false,
  onOcrFailed,
  isInvalidReading = false,
  onInvalidReading,
}: PhotoCaptureHUDOcrConfirmModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const filtered = mode === OcrMode.ODOMETER ? raw.replace(/[^0-9]/g, '') : raw.toUpperCase();
    onEditChange?.(filtered);
  };

  const confirmDisabled = isEditing ? !editValue : isOcrLoading && !text;
  const showUnitDropdown =
    mode === OcrMode.ODOMETER &&
    !isInvalidReading &&
    !ocrFailed &&
    !(isOcrLoading && !text && !editValue);

  return (
    <BackdropDialog
      show
      dialog={
        <OcrConfirmDialogContent
          imageUri={imageUri}
          displayContent={
            <OcrDisplay
              isInvalidReading={isInvalidReading}
              ocrFailed={ocrFailed}
              isOcrLoading={isOcrLoading}
              text={text}
              isEditing={isEditing}
              editValue={editValue}
              mode={mode}
              inputRef={inputRef}
              onChange={handleInputChange}
            />
          }
          buttonContent={
            <OcrButtons
              isInvalidReading={isInvalidReading}
              ocrFailed={ocrFailed}
              isEditing={isEditing}
              confirmDisabled={confirmDisabled}
              onConfirm={onConfirm}
              onReject={onReject}
              onEditCancel={onEditCancel}
              onInvalidReading={onInvalidReading}
              onOcrFailed={onOcrFailed}
            />
          }
          showUnitDropdown={showUnitDropdown}
          selectedUnit={selectedUnit}
          onUnitChange={onUnitChange}
        />
      }
    />
  );
}
