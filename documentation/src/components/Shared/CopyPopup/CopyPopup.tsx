import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { Icon } from '@monkvision/common-ui-web';
import styles from './CopyPopup.module.css';

export interface CopyPopupHandle {
  open: () => void;
  close: () => void;
  openForMs: (durationMs: number) => void;
}

export interface CopyPopupProps {
  displayed?: boolean;
}

export const CopyPopup = forwardRef<CopyPopupHandle, CopyPopupProps>(
  ({ displayed = false }, ref) => {
    const [isDisplayed, setIsDisplayed] = useState(displayed);

    const open = useCallback(() => setIsDisplayed(true), []);
    const close = useCallback(() => setIsDisplayed(false), []);
    const openForMs = useCallback(
      (durationMs: number) => {
        open();
        setTimeout(() => {
          close();
        }, durationMs);
      },
      [open, close],
    );
    useImperativeHandle(ref, () => ({ open, close, openForMs }));

    return isDisplayed ? (
      <div className={styles['popup-container']}>
        <span>Copied to clipboard</span>
        <Icon icon='check' size={15} primaryColor={'#ffffff'} />
        <div className={styles['arrow-down']}></div>
      </div>
    ) : null;
  },
);
