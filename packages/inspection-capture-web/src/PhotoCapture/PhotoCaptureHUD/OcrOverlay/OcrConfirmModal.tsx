import React, { CSSProperties } from 'react';
import { BackdropDialog, Button } from '@monkvision/common-ui-web';

export interface OcrConfirmModalProps {
  /** The confirmed text to display below the image. */
  text: string;
  /** The cropped frame image as a data URL. */
  imageUri: string;
  /** Called when the user confirms the detected text. */
  onConfirm: () => void;
  /** Called when the user rejects the detected text. */
  onReject: () => void;
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

  buttons: {
    display: 'flex',
    gap: 16,
    width: '100%',
  } as CSSProperties,

  button: {
    flex: 1,
  } as CSSProperties,
};

export function OcrConfirmModal({ text, imageUri, onConfirm, onReject }: OcrConfirmModalProps) {
  const dialog = (
    <div style={styles.dialog}>
      <img src={imageUri} alt='Detected frame' style={styles.image} />
      <div style={styles.text}>{text}</div>
      <div style={styles.buttons}>
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
      </div>
    </div>
  );

  return <BackdropDialog show dialog={dialog} />;
}
