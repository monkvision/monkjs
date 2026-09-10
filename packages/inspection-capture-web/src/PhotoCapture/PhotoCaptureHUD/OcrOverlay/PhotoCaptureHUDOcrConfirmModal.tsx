import React from 'react';
import { BackdropDialog, Button } from '@monkvision/common-ui-web';
import { OcrMode } from '../../hooks';
import { styles, SPINNER_KEYFRAMES } from './PhotoCaptureHUDOcrConfirmModal.styles';

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
  isOcrLoading = false,
  ocrFailed = false,
  onOcrFailed,
  isInvalidReading = false,
  onInvalidReading,
}: PhotoCaptureHUDOcrConfirmModalProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const filtered = mode === 'odometer' ? raw.replace(/[^0-9]/g, '') : raw.toUpperCase();
    onEditChange?.(filtered);
  };

  const confirmDisabled = isEditing ? !editValue : isOcrLoading && !text;

  const dialog = (
    <div style={styles.dialog}>
      <style>{SPINNER_KEYFRAMES}</style>
      <img src={imageUri} alt='Detected frame' style={styles.image} />
      {isInvalidReading ? (
        <div style={styles.errorMessage}>The detected value is not valid. Please scan again.</div>
      ) : ocrFailed ? (
        <div style={styles.errorMessage}>
          Unable to detect the text. You can proceed to the next sight.
        </div>
      ) : isOcrLoading && !text && !editValue ? (
        <div style={styles.spinner} />
      ) : isEditing ? (
        <input
          style={styles.input}
          value={editValue}
          onChange={handleInputChange}
          inputMode={mode === 'odometer' ? 'numeric' : 'text'}
          autoFocus
        />
      ) : (
        <div style={styles.text}>{text}</div>
      )}
      <div style={styles.buttons}>
        {isInvalidReading ? (
          <Button
            variant='outline'
            primaryColor='alert-light'
            secondaryColor='background-dark'
            style={styles.button}
            onClick={onInvalidReading}
          >
            Close
          </Button>
        ) : ocrFailed ? (
          <Button
            variant='outline'
            primaryColor='primary-xlight'
            secondaryColor='background-dark'
            style={styles.button}
            onClick={onOcrFailed}
          >
            Continue
          </Button>
        ) : isEditing ? (
          <>
            <Button
              variant='outline'
              primaryColor='alert-light'
              secondaryColor='background-dark'
              style={styles.button}
              onClick={onEditCancel}
            >
              Cancel
            </Button>
            <Button
              variant='outline'
              primaryColor='primary-xlight'
              secondaryColor='background-dark'
              style={styles.button}
              disabled={confirmDisabled}
              onClick={onConfirm}
            >
              Confirm
            </Button>
          </>
        ) : (
          <>
            <Button
              variant='outline'
              primaryColor='alert-light'
              secondaryColor='background-dark'
              style={styles.button}
              onClick={onReject}
            >
              No
            </Button>
            <Button
              variant='outline'
              primaryColor='primary-xlight'
              secondaryColor='background-dark'
              style={styles.button}
              disabled={confirmDisabled}
              onClick={onConfirm}
            >
              Yes
            </Button>
          </>
        )}
      </div>
    </div>
  );

  return <BackdropDialog show dialog={dialog} />;
}
