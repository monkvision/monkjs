import { useCallback, useRef, useState } from 'react';
import { useObjectMemo } from '@monkvision/common';
import { CaptureAppConfig } from '@monkvision/types';
import { UploadEventHandlers } from './useUploadQueue';

/**
 * Parameters accepted by the useBadConnectionWarning hook.
 */
export type BadConnectionWarningParams = Required<
  Pick<CaptureAppConfig, 'maxUploadDurationWarning'>
>;

/**
 * Handle used to manage the bad connection warning displayed to the user when uploads are failing.
 */
export interface BadConnectionWarningHandle {
  /**
   * Boolean indicating if the bad connection warning pop-up should be displayed or not.
   */
  isBadConnectionWarningDialogDisplayed: boolean;
  /**
   * Callback called when the user closes the bad connection warning modal.
   */
  closeBadConnectionWarningDialog: () => void;
  /**
   * A set of event handlers listening to upload events.
   */
  uploadEventHandlers: UploadEventHandlers;
}

/**
 * Custom hook used to handle the state managing the dialog displayed to the user when he has a bad connection.
 */
export function useBadConnectionWarning({
  maxUploadDurationWarning,
}: BadConnectionWarningParams): BadConnectionWarningHandle {
  const [isBadConnectionWarningDialogDisplayed, setIsBadConnectionWarningDialogDisplayed] =
    useState(false);
  const hadDialogBeenDisplayed = useRef(false);

  const closeBadConnectionWarningDialog = useCallback(
    () => setIsBadConnectionWarningDialogDisplayed(false),
    [],
  );

  const onUploadSuccess = useCallback(
    (durationMs: number) => {
      if (
        maxUploadDurationWarning >= 0 &&
        durationMs > maxUploadDurationWarning &&
        !hadDialogBeenDisplayed.current
      ) {
        setIsBadConnectionWarningDialogDisplayed(true);
        hadDialogBeenDisplayed.current = true;
      }
    },
    [maxUploadDurationWarning, hadDialogBeenDisplayed],
  );

  const onUploadTimeout = useCallback(() => {
    if (maxUploadDurationWarning >= 0 && !hadDialogBeenDisplayed.current) {
      setIsBadConnectionWarningDialogDisplayed(true);
      hadDialogBeenDisplayed.current = true;
    }
  }, [maxUploadDurationWarning, hadDialogBeenDisplayed]);

  return useObjectMemo({
    isBadConnectionWarningDialogDisplayed,
    closeBadConnectionWarningDialog,
    uploadEventHandlers: {
      onUploadSuccess,
      onUploadTimeout,
    },
  });
}
