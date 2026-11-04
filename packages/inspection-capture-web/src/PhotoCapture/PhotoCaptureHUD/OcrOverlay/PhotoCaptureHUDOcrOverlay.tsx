import { useTranslation } from 'react-i18next';
import { MonkPicture, MileageUnit, OcrMode } from '@monkvision/types';
import { PhotoCaptureHUDOcrConfirmModal } from './PhotoCaptureHUDOcrConfirmModal';
import { PhotoCaptureOcrConfig } from '../../hooks';
import {
  getCropBoxStyle,
  getShutterHintStyle,
  RADIUS,
  STROKE,
  COLOR_IDLE,
  COLOR_CONFIRMED,
  getPerimeter,
  getOverlayStyle,
  styles,
} from './PhotoCaptureHUDOcrOverlay.styles';
import { usePhotoCaptureHUDOcrOverlay } from './usePhotoCaptureHUDOcrOverlay';

export interface PhotoCaptureHUDOcrOverlayProps {
  /** OCR and capture configuration (models, intervals, retry limits). */
  config: PhotoCaptureOcrConfig;
  /** Returns the current camera frame as ImageData for live OCR processing. */
  getImageData: () => ImageData;
  /** When true, the camera is still initializing and frame capture should be skipped. */
  isCameraLoading: boolean;
  /** When false, the overlay renders nothing (non-OCR sight selected). */
  isActive: boolean;
  /** Actual rendered pixel dimensions of the video content on screen (excluding letterbox bars). */
  previewDimensions: { width: number; height: number } | null;
  /** OCR mode active for the current sight (odometer, vin, …). */
  mode?: OcrMode;
  /** Fallback unit used when OCR cannot detect one from the text (odometer mode only). */
  defaultMileageUnit?: MileageUnit;
  /** Called when the user confirms the OCR-detected text in the modal. */
  onConfirm?: (
    text: string,
    picture: MonkPicture,
    mode: OcrMode | undefined,
    defaultMileageUnit: MileageUnit | undefined,
  ) => void;
  /** Called when the user rejects the OCR-detected text in the modal. */
  onReject?: () => void;
  /** Called once when the retry/timeout limit is reached — signals the parent to unlock the shutter. */
  onFallbackReady?: () => void;
  /** Full-frame picture taken by the user in fallback mode. OCR runs on its crop region. */
  fallbackPicture?: MonkPicture | null;
  /** Current sight ID — used to reset OCR state when the active sight changes. */
  sightId?: string;
}

/**
 * Camera overlay that drives live OCR on the current sight. It draws a crop-box frame over the
 * region of interest, runs the OCR model on successive frames until a reading is confirmed, then
 * shows a confirmation modal. When the retry or timeout limit is reached the shutter is unlocked
 * so the user can take a manual picture; OCR then runs on the crop of that picture instead.
 */
export function PhotoCaptureHUDOcrOverlay({
  config,
  getImageData,
  isCameraLoading,
  isActive,
  previewDimensions,
  mode,
  defaultMileageUnit,
  onConfirm,
  onReject,
  onFallbackReady,
  fallbackPicture,
  sightId,
}: PhotoCaptureHUDOcrOverlayProps) {
  const { t } = useTranslation();
  const {
    isFallbackReady,
    cropRegion,
    ocrPicture,
    isEditing,
    editText,
    selectedUnit,
    isManualVinError,
    fallbackOcrFailed,
    showModal,
    modalText,
    isInvalidReading,
    isOcrLoading,
    consistencyCount,
    fillFraction,
    handleConfirm,
    handleRejection,
    handleEditCancel,
    handleInvalidReadingClose,
    handleOcrFailed,
    handleEditChange,
    handleUnitChange,
  } = usePhotoCaptureHUDOcrOverlay({
    config,
    getImageData,
    isCameraLoading,
    isActive,
    previewDimensions,
    mode,
    defaultMileageUnit,
    onConfirm,
    onReject,
    onFallbackReady,
    fallbackPicture,
    sightId,
  });

  if (!isActive) {
    return null;
  }

  const overlayStyle = getOverlayStyle(previewDimensions);
  const containerW = previewDimensions?.width ?? 0;
  const containerH = previewDimensions?.height ?? 0;
  const boxW = containerW * cropRegion.w;
  const boxH = containerH * cropRegion.h;
  const perimeter = getPerimeter(boxW, boxH);
  const filledLength = fillFraction * perimeter;

  const rectProps = {
    x: STROKE / 2,
    y: STROKE / 2,
    width: boxW - STROKE,
    height: boxH - STROKE,
    rx: RADIUS,
    fill: 'none',
  };

  return (
    <>
      {showModal && (
        <PhotoCaptureHUDOcrConfirmModal
          text={modalText}
          imageUri={ocrPicture?.uri ?? ''}
          onConfirm={handleConfirm}
          onReject={handleRejection}
          isEditing={isEditing}
          editValue={editText}
          onEditChange={handleEditChange}
          onEditCancel={handleEditCancel}
          mode={mode}
          selectedUnit={selectedUnit}
          onUnitChange={handleUnitChange}
          isOcrLoading={isOcrLoading}
          ocrFailed={fallbackOcrFailed}
          onOcrFailed={handleOcrFailed}
          isInvalidReading={isInvalidReading || isManualVinError}
          onInvalidReading={handleInvalidReadingClose}
        />
      )}
      <div style={overlayStyle}>
        {isFallbackReady && !ocrPicture && (
          <div style={getShutterHintStyle(cropRegion)}>{t('photo.hud.ocr.shutterHint')}</div>
        )}
        <div style={getCropBoxStyle(cropRegion)}>
          <svg
            viewBox={`0 0 ${boxW} ${boxH}`}
            style={styles.svg}
            xmlns='http://www.w3.org/2000/svg'
          >
            <rect {...rectProps} stroke='#ffffff' strokeWidth={STROKE} opacity={0.2} />
            <rect
              {...rectProps}
              stroke={COLOR_IDLE}
              strokeWidth={STROKE}
              strokeDasharray='8 6'
              opacity={consistencyCount > 0 || fillFraction >= 1 ? 0 : 0.6}
              style={styles.rectOpacity}
            />
            <rect
              {...rectProps}
              stroke={COLOR_CONFIRMED}
              strokeWidth={STROKE}
              strokeDasharray={`${filledLength} ${perimeter}`}
              strokeLinecap='round'
              style={styles.rectDash}
            />
          </svg>
        </div>
      </div>
    </>
  );
}
