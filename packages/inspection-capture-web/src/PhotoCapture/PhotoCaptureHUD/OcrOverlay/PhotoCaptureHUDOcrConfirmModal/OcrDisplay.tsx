import React from 'react';
import { useTranslation } from 'react-i18next';
import { OcrMode } from '@monkvision/types';
import { styles } from './PhotoCaptureHUDOcrConfirmModal.styles';

export interface OcrDisplayProps {
  /** When true, renders the "invalid reading" error message. */
  isInvalidReading: boolean;
  /** When true, renders the "OCR failed" error message. */
  ocrFailed: boolean;
  /** When true and no text is available yet, renders the loading spinner. */
  isOcrLoading: boolean;
  /** The OCR-detected text to display in the read-only state. */
  text: string;
  /** When true, renders the editable input instead of the text. */
  isEditing: boolean;
  /** Current value of the controlled input (editing state). */
  editValue: string;
  /** OCR mode — determines the input keyboard type. */
  mode?: OcrMode;
  /** Ref forwarded to the input element so the parent can focus it. */
  inputRef: React.RefObject<HTMLInputElement | null>;
  /** Called on every keystroke in the input field. */
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

/** Renders the OCR text, input field, spinner, or error message based on the current state. */
export const OcrDisplay = ({
  isInvalidReading,
  ocrFailed,
  isOcrLoading,
  text,
  isEditing,
  editValue,
  mode,
  inputRef,
  onChange,
}: OcrDisplayProps) => {
  const { t } = useTranslation();
  if (isInvalidReading) {
    return <div style={styles.errorMessage}>{t('photo.hud.ocr.invalidReading')}</div>;
  }
  if (ocrFailed) {
    return <div style={styles.errorMessage}>{t('photo.hud.ocr.ocrFailed')}</div>;
  }
  if (isOcrLoading && !text && !editValue) {
    return <div style={styles.spinner} />;
  }
  if (isEditing) {
    return (
      <input
        ref={inputRef}
        style={styles.input}
        value={editValue}
        onChange={onChange}
        inputMode={mode === OcrMode.ODOMETER ? 'numeric' : 'text'}
      />
    );
  }
  return <div style={styles.text}>{text}</div>;
}
