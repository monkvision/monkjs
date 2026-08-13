import React, { useEffect, useRef, useState } from 'react';
import { useInterval } from '@monkvision/common';
import { useOcr, OCR_STABILIZER_CONFIG, createCanvas, get2dContext } from '@monkvision/ml-web';
import { MonkPicture } from '@monkvision/types';
import { OcrConfirmModal } from './OcrConfirmModal';
import { OcrMode, PhotoCaptureOcrConfig } from '../../hooks';
import { formatOdometerDisplay, parseOdometerText } from './ocrText.utils';
import {
  CROP_REGION,
  RADIUS,
  STROKE,
  COLOR_IDLE,
  COLOR_CONFIRMED,
  getPerimeter,
  getOverlayStyle,
  styles,
} from './OcrOverlay.styles';

export interface OcrOverlayProps {
  config: PhotoCaptureOcrConfig;
  getImageData: () => ImageData;
  isCameraLoading: boolean;
  isActive: boolean;
  /** Actual rendered pixel dimensions of the video content on screen (excluding letterbox bars). */
  previewDimensions: { width: number; height: number } | null;
  /** OCR mode active for the current sight (odometer, vin, …). */
  mode?: OcrMode;
  /** Called when the user confirms the OCR-detected text in the modal. */
  onConfirm?: (text: string, picture: MonkPicture, mode: OcrMode | undefined) => void;
  /** Called when the user rejects the OCR-detected text in the modal. */
  onReject?: () => void;
}

const resolveModelColor = (fatalError: string | null, isReady: boolean, isLoading: boolean) => {
  if (fatalError) {
    return '#ff4444';
  }
  if (isReady) {
    return '#44ff88';
  }
  if (isLoading) {
    return '#ffaa00';
  }
  return '#888888';
};

export function OcrOverlay({
  config,
  getImageData,
  isCameraLoading,
  isActive,
  previewDimensions,
  mode,
  onConfirm,
  onReject,
}: OcrOverlayProps) {
  const {
    captureIntervalMs = OCR_STABILIZER_CONFIG.captureIntervalMs,
    appearanceCount = OCR_STABILIZER_CONFIG.appearanceCount,
    ...ocrConfig
  } = config;
  const {
    isReady,
    isLoading,
    isInferring,
    fatalError,
    loadModels,
    processFrame,
    confirmedText,
    detectedText,
    consistencyCount,
    reset,
  } = useOcr({ ...ocrConfig, appearanceCount });

  const srcCanvasRef = useRef<OffscreenCanvas | HTMLCanvasElement | null>(null);
  const cropCanvasRef = useRef<OffscreenCanvas | HTMLCanvasElement | null>(null);
  const cropCoordsRef = useRef<{ sx: number; sy: number; sw: number; sh: number } | null>(null);

  const [ocrPicture, setOcrPicture] = useState<MonkPicture | null>(null);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  useEffect(() => {
    if (!confirmedText || !cropCanvasRef.current) {
      return;
    }
    const canvas = cropCanvasRef.current;
    const { width, height } = canvas;
    const mimetype = 'image/jpeg';

    const applyBlob = (blob: Blob) => {
      const uri = URL.createObjectURL(blob);
      setOcrPicture({ blob, uri, mimetype, width, height });
    };

    if (canvas instanceof HTMLCanvasElement) {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            applyBlob(blob);
          }
        },
        mimetype,
        0.92,
      );
    } else {
      canvas
        .convertToBlob({ type: mimetype, quality: 0.92 })
        .then(applyBlob)
        .catch(() => setOcrPicture(null));
    }
  }, [confirmedText]);

  useInterval(
    () => {
      if (!isReady || !isActive || isCameraLoading) {
        return undefined;
      }
      try {
        const full = getImageData();

        if (!cropCoordsRef.current || srcCanvasRef.current?.width !== full.width) {
          cropCoordsRef.current = {
            sx: Math.round(CROP_REGION.x * full.width),
            sy: Math.round(CROP_REGION.y * full.height),
            sw: Math.round(CROP_REGION.w * full.width),
            sh: Math.round(CROP_REGION.h * full.height),
          };
        }
        const { sx, sy, sw, sh } = cropCoordsRef.current;

        if (
          !srcCanvasRef.current ||
          srcCanvasRef.current.width !== full.width ||
          srcCanvasRef.current.height !== full.height
        ) {
          srcCanvasRef.current = createCanvas(full.width, full.height);
        }
        if (
          !cropCanvasRef.current ||
          cropCanvasRef.current.width !== sw ||
          cropCanvasRef.current.height !== sh
        ) {
          cropCanvasRef.current = createCanvas(sw, sh);
        }

        const srcCtx = get2dContext(srcCanvasRef.current);
        const cropCtx = get2dContext(cropCanvasRef.current);

        srcCtx.putImageData(full, 0, 0);
        cropCtx.drawImage(srcCanvasRef.current, sx, sy, sw, sh, 0, 0, sw, sh);
        processFrame(cropCtx.getImageData(0, 0, sw, sh));
      } catch {
        /* camera not ready */
      }
      return undefined;
    },
    isReady && isActive ? captureIntervalMs : null,
  );

  const modelColor = resolveModelColor(fatalError, isReady, isLoading);
  const inferColor = isInferring ? '#44ff88' : '#888888';

  const debugDots = (
    <div style={styles.debugDots}>
      <div style={styles.debugDotsRow}>
        <div style={styles.debugDotItem}>
          <div style={styles.debugDotDot(modelColor)} />
          <span style={styles.debugDotLabel}>model</span>
        </div>
        <div style={styles.debugDotItem}>
          <div style={styles.debugDotDot(inferColor)} />
          <span style={styles.debugDotLabel}>infer</span>
        </div>
      </div>
      {fatalError && <div style={styles.errorText}>{fatalError}</div>}
    </div>
  );

  const overlayStyle = getOverlayStyle(previewDimensions);

  if (!isActive) {
    return <div style={overlayStyle}>{debugDots}</div>;
  }

  const isConfirmed = confirmedText !== null;
  const showModal = isConfirmed && ocrPicture !== null;

  const handleConfirm = () => {
    if (ocrPicture) {
      onConfirm?.(confirmedText ?? '', ocrPicture, mode);
    }
  };

  const handleReject = () => {
    setOcrPicture(null);
    reset();
    onReject?.();
  };

  const isOdometer = mode === 'odometer';
  const rawDisplayText = confirmedText ?? (detectedText || null);
  const displayText =
    isOdometer && rawDisplayText
      ? formatOdometerDisplay(parseOdometerText(rawDisplayText))
      : rawDisplayText;
  let modalText = confirmedText ?? '';
  if (isConfirmed && confirmedText) {
    modalText = isOdometer
      ? formatOdometerDisplay(parseOdometerText(confirmedText))
      : confirmedText;
  }
  const fillFraction = isConfirmed ? 1 : consistencyCount / appearanceCount;
  const containerW = previewDimensions?.width ?? 0;
  const containerH = previewDimensions?.height ?? 0;
  const boxW = containerW * CROP_REGION.w;
  const boxH = containerH * CROP_REGION.h;
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

  const statusText = (() => {
    if (isConfirmed) {
      return '✓ VIN confirmed';
    }
    if (consistencyCount > 0) {
      return `${consistencyCount} / ${appearanceCount} consistent reads`;
    }
    return 'Scanning…';
  })();

  return (
    <>
      {showModal && (
        <OcrConfirmModal
          text={modalText}
          imageUri={ocrPicture?.uri ?? ''}
          onConfirm={handleConfirm}
          onReject={handleReject}
        />
      )}
      <div style={overlayStyle}>
        {debugDots}
        <div style={styles.cropBox}>
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
              opacity={consistencyCount > 0 || isConfirmed ? 0 : 0.6}
              style={{ transition: 'opacity 0.3s ease' }}
            />
            <rect
              {...rectProps}
              stroke={COLOR_CONFIRMED}
              strokeWidth={STROKE}
              strokeDasharray={`${filledLength} ${perimeter}`}
              strokeLinecap='round'
              style={{ transition: 'stroke-dasharray 0.4s ease' }}
            />
          </svg>

          {displayText && <div style={styles.detectedText(isConfirmed)}>{displayText}</div>}

          <div style={styles.statusLabel}>{statusText}</div>
        </div>
      </div>
    </>
  );
}
