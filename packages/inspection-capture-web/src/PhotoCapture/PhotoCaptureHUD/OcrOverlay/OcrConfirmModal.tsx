import React, { CSSProperties } from 'react';
import { BackdropDialog, Button } from '@monkvision/common-ui-web';
import { OcrMode } from '../../hooks';

export interface OcrConfirmModalProps {
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
}

const SPINNER_KEYFRAMES = `
@keyframes ocrModalSpin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
`;

const styles = {
  dialog: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: '24px 28px',
    maxWidth: 420,
    width: '90vw',
  } as CSSProperties,

  spinner: {
    width: 28,
    height: 28,
    border: '3px solid rgba(255,255,255,0.15)',
    borderTopColor: '#ffffff',
    borderRadius: '50%',
    animation: 'ocrModalSpin 0.8s linear infinite',
  } as CSSProperties,

  image: {
    width: '100%',
    borderRadius: 8,
    objectFit: 'contain',
    maxHeight: 180,
    background: '#000',
  } as CSSProperties,

  text: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 4,
    fontFamily: 'monospace',
    textAlign: 'center',
  } as CSSProperties,

  input: {
    width: '100%',
    background: '#2a2a2a',
    border: '1.5px solid #444',
    borderRadius: 8,
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    letterSpacing: 4,
    textAlign: 'center',
    padding: '10px 12px',
    outline: 'none',
    boxSizing: 'border-box',
  } as CSSProperties,

  errorMessage: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 1.5,
  } as CSSProperties,

  buttons: {
    display: 'flex',
    gap: 16,
    width: '100%',
  } as CSSProperties,

  button: {
    flex: 1,
  } as CSSProperties,
};

export function OcrConfirmModal({
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
}: OcrConfirmModalProps) {
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
      {ocrFailed ? (
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
        {ocrFailed ? (
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
