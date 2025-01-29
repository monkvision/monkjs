import { useCallback, useState } from 'react';
import { PhotoCaptureAppConfig, PhotoCaptureSightGuidelinesOption } from '@monkvision/types';
import { useObjectMemo } from '@monkvision/common';

export const STORAGE_KEY_PHOTO_CAPTURE_GUIDELINES = '@monk_photoCaptureSightGuideline';
export const TTL_MS = 48 * 60 * 60 * 1000;

function isTTLExpired(): boolean {
  const timestamp = localStorage.getItem(STORAGE_KEY_PHOTO_CAPTURE_GUIDELINES);
  if (timestamp) {
    console.log(Date.now() - parseInt(timestamp, 10) > TTL_MS);
  }

  return !timestamp || Date.now() - parseInt(timestamp, 10) > TTL_MS;
}

function getShowSightGuidelines(
  enableSightGuidelines?: PhotoCaptureSightGuidelinesOption,
): boolean {
  switch (enableSightGuidelines) {
    case PhotoCaptureSightGuidelinesOption.DISABLED:
      return false;
    case PhotoCaptureSightGuidelinesOption.EPHEMERAL:
      return isTTLExpired();
    default:
      return true;
  }
}

/**
 * Parameters of the usePhotoCaptureSightGuidelines hook.
 */
export interface PhotoCaptureSightGuidelines
  extends Pick<PhotoCaptureAppConfig, 'enableSightGuidelines'> {}

/**
 * Handle returned by the usePhotoCaptureSightGuidelines hook to manage the SightGuidelines feature.
 */
export interface PhotoCaptureSightGuidelinesHandle {
  /**
   * Boolean indicating if the sight guidelines are enabled or not.
   */
  showSightGuidelines: boolean;
  /**
   * Callback called when the user clicks on both: 'disable' checkbox and 'okay' button.
   */
  onDisableSightGuidelines?: () => void;
}

/**
 * Custom hook used to manage the state of photo capture sight guidelines.
 */
export function usePhotoCaptureSightGuidelines({
  enableSightGuidelines,
}: PhotoCaptureSightGuidelines) {
  const [showSightGuidelines, setShowSightGuidelines] = useState(() =>
    getShowSightGuidelines(enableSightGuidelines),
  );

  const handleDisableSightGuidelines = useCallback(() => {
    if (enableSightGuidelines === PhotoCaptureSightGuidelinesOption.EPHEMERAL) {
      localStorage.setItem(STORAGE_KEY_PHOTO_CAPTURE_GUIDELINES, Date.now().toString());
      setShowSightGuidelines(false);
    }
    if (enableSightGuidelines === PhotoCaptureSightGuidelinesOption.ENABLED) {
      setShowSightGuidelines(false);
    }
  }, []);

  return useObjectMemo({ showSightGuidelines, handleDisableSightGuidelines });
}
