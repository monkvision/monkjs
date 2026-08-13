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
}

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
}: OcrConfirmModalProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const filtered = mode === 'odometer' ? raw.replace(/[^0-9]/g, '') : raw.toUpperCase();
    onEditChange?.(filtered);
  };

  const dialog = (
    <div style={styles.dialog}>
      <img src={imageUri} alt='Detected frame' style={styles.image} />
      {isEditing ? (
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
        {isEditing ? (
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
