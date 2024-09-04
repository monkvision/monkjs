import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Icon } from '../../domOnly';
import styles from './CopyPopup.module.css';

export interface CopyPopupHandle {
  open: () => void;
  close: () => void;
  openForMs: (durationMs: number) => void;
}

export interface CopyPopupProps {
  displayed?: boolean;
}

export const CopyPopup = forwardRef<CopyPopupHandle, CopyPopupProps>(function CopyPopup(
  { displayed = false },
  ref,
) {
  const [isDisplayed, setIsDisplayed] = useState(displayed);

  const open = () => setIsDisplayed(true);
  const close = () => setIsDisplayed(false);
  const openForMs = (durationMs: number) => {
    open();
    setTimeout(() => {
      close();
    }, durationMs);
  };
  useImperativeHandle(ref, () => ({ open, close, openForMs }));

  return isDisplayed ? (
    <div className={styles['popup-container']}>
      <span>Copied to clipboard</span>
      <Icon icon='check' size={15} primaryColor={'#ffffff'} />
      <div className={styles['arrow-down']}></div>
    </div>
  ) : null;
});
