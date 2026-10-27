import { useCallback, useEffect, useState } from 'react';
import { NetworkQuality, useObjectMemo } from '@monkvision/common';

/**
 * Parameters accepted by the useNetworkWarning hook.
 */
export interface NetworkWarningParams {
  /**
   * Boolean indicating if the network warning is enabled.
   */
  enabled: boolean;
  /**
   * The current network quality (given by the `useNetworkStatus` hook).
   */
  quality: NetworkQuality;
  /**
   * The number of uploads that failed and are waiting to be uploaded again.
   */
  failedUploadsCount: number;
}

/**
 * Handle used to manage the network warning displayed to the user when the connection is lost or too poor.
 */
export interface NetworkWarningHandle {
  /**
   * Boolean indicating if the network warning pop-up should be displayed or not.
   */
  isNetworkWarningDialogDisplayed: boolean;
  /**
   * The network quality that triggered the warning (`OFFLINE` or `POOR`).
   */
  networkWarningQuality: NetworkQuality | null;
  /**
   * Callback called when the user closes the network warning pop-up.
   */
  closeNetworkWarningDialog: () => void;
}

/**
 * Custom hook used to handle the state managing the pop-up displayed to the user when the connection is lost
 * (`NetworkQuality.OFFLINE`), or when it is too poor (`NetworkQuality.POOR`) and some uploads failed. The pop-up is
 * only displayed once per connection issue : it will only be displayed again after the connection has become good
 * again.
 */
export function useNetworkWarning({
  enabled,
  quality,
  failedUploadsCount,
}: NetworkWarningParams): NetworkWarningHandle {
  const [isNetworkWarningDialogDisplayed, setIsNetworkWarningDialogDisplayed] = useState(false);
  const [networkWarningQuality, setNetworkWarningQuality] = useState<NetworkQuality | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    if (quality === NetworkQuality.GOOD) {
      setIsNetworkWarningDialogDisplayed(false);
      setNetworkWarningQuality(null);
      return;
    }
    const shouldWarn =
      quality === NetworkQuality.OFFLINE ||
      (quality === NetworkQuality.POOR && failedUploadsCount > 0);
    if (shouldWarn && networkWarningQuality === null) {
      setNetworkWarningQuality(quality);
      setIsNetworkWarningDialogDisplayed(true);
    }
  }, [enabled, quality, failedUploadsCount, networkWarningQuality]);

  const closeNetworkWarningDialog = useCallback(
    () => setIsNetworkWarningDialogDisplayed(false),
    [],
  );

  return useObjectMemo({
    isNetworkWarningDialogDisplayed,
    networkWarningQuality,
    closeNetworkWarningDialog,
  });
}
