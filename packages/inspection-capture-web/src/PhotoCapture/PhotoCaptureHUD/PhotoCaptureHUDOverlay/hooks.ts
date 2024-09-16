import { CameraHandle, getCameraErrorLabel } from '@monkvision/camera-web';
import { useTranslation } from 'react-i18next';
import { useObjectTranslation } from '@monkvision/common';
import { MonkNetworkError } from '@monkvision/network';
import { PhotoCaptureErrorName } from '../../errors';

/**
 * Props of the PhotoCaptureHUDOverlay component.
 */
export interface PhotoCaptureHUDOverlayProps {
  /**
   * Boolean indicating if the global loading state of the PhotoCapture component is loading or not.
   */
  isCaptureLoading: boolean;
  /**
   * The error that occurred in the PhotoCapture component. Set this value to `null` if there is no error.
   */
  captureError: unknown | null;
  /**
   * The Camera handle.
   */
  handle: CameraHandle;
  /**
   * Callback called when the user wants to retry fetching inspection data.
   */
  onRetry: () => void;
  /**
   * The inspection ID.
   */
  inspectionId: string;
}

export function usePhotoCaptureErrorLabel(
  captureError: unknown | null,
  handle: CameraHandle,
  inspectionId: string,
): string | null {
  const { t } = useTranslation();
  const { tObj } = useObjectTranslation();
  const cameraErrorLabel = getCameraErrorLabel(handle.error?.type);

  if (handle.error && cameraErrorLabel) {
    return tObj(cameraErrorLabel);
  }
  if (captureError instanceof Error) {
    if (captureError.name === PhotoCaptureErrorName.MISSING_TASK_IN_INSPECTION) {
      return t('photo.hud.error.missingTasks');
    }
    if (
      [MonkNetworkError.MISSING_TOKEN, MonkNetworkError.INVALID_TOKEN].includes(
        captureError.name as MonkNetworkError,
      )
    ) {
      return t('photo.hud.error.invalidToken');
    }
    if (captureError.name === MonkNetworkError.EXPIRED_TOKEN) {
      return t('photo.hud.error.expiredToken');
    }
    if (captureError.name === MonkNetworkError.INSUFFICIENT_AUTHORIZATION) {
      return t('photo.hud.error.insufficientAuth');
    }
    if (captureError.name === MonkNetworkError.RESOURCE_NOT_FOUND) {
      return t('photo.hud.error.resourceNotFound');
    }
    if (captureError.name === MonkNetworkError.INVALID_ARGUMENT) {
      return t('photo.hud.error.invalidArgument');
    }
  }

  if (captureError) {
    return `${t('photo.hud.error.inspectionLoading')} ${inspectionId}`;
  }
  return null;
}

export function useRetry({
  captureError,
  handle,
  onRetry,
}: Pick<PhotoCaptureHUDOverlayProps, 'captureError' | 'handle' | 'onRetry'>): (() => void) | null {
  if (handle.error) {
    return handle.retry;
  }
  if (
    captureError instanceof Error &&
    [
      PhotoCaptureErrorName.MISSING_TASK_IN_INSPECTION,
      MonkNetworkError.MISSING_TOKEN,
      MonkNetworkError.INVALID_TOKEN,
      MonkNetworkError.EXPIRED_TOKEN,
      MonkNetworkError.INSUFFICIENT_AUTHORIZATION,
      MonkNetworkError.RESOURCE_NOT_FOUND,
      MonkNetworkError.INVALID_ARGUMENT,
    ].includes(captureError.name as MonkNetworkError)
  ) {
    return null;
  }
  if (captureError) {
    return onRetry;
  }
  return null;
}
