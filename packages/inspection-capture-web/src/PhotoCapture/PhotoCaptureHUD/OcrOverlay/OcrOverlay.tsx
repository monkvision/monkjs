import React, { useEffect, useRef, useState } from 'react';
import { useOcr, OCR_STABILIZER_CONFIG } from '@monkvision/ml-web';
import { PhotoCaptureOcrConfig } from '../../hooks';

const CROP_REGION = { x: 0.2, y: 0.4, w: 0.6, h: 0.2 };
const RADIUS = 6;
const STROKE = 2.5;

const COLOR_IDLE = 'rgba(255,255,255,0.5)';
const COLOR_MATCH = '#ffffff';
const COLOR_CONFIRMED = '#22c55e';

function getPerimeter(w: number, h: number): number {
  return 2 * (w - 2 * RADIUS) + 2 * (h - 2 * RADIUS) + 2 * Math.PI * RADIUS;
}

export interface OcrOverlayProps {
  config: PhotoCaptureOcrConfig;
  getImageData: () => ImageData;
  isCameraLoading: boolean;
  isActive: boolean;
  /** Actual rendered pixel dimensions of the video content on screen (excluding letterbox bars). */
  previewDimensions: { width: number; height: number } | null;
}

export function OcrOverlay({
  config,
  getImageData,
  isCameraLoading,
  isActive,
  previewDimensions,
}: OcrOverlayProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    captureIntervalMs = OCR_STABILIZER_CONFIG.captureIntervalMs,
    activeSightId: _a,
    appearanceCount = OCR_STABILIZER_CONFIG.appearanceCount,
    ...ocrConfig
  } = config;
  const {
    isReady,
    isLoading,
    fatalError,
    loadModels,
    processFrame,
    confirmedText,
    detectedText,
    consistencyCount,
  } = useOcr({ ...ocrConfig, appearanceCount });

  const cropCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const srcCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [inferring, setInferring] = useState(false);
  const inferTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setInferringRef = useRef(setInferring);
  const inferTimerRefRef = useRef(inferTimerRef);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  useEffect(() => {
    if (!isReady || !isActive) return;
    const interval = setInterval(() => {
      if (isCameraLoading) return;
      try {
        const full = getImageData();
        const sx = Math.round(CROP_REGION.x * full.width);
        const sy = Math.round(CROP_REGION.y * full.height);
        const sw = Math.round(CROP_REGION.w * full.width);
        const sh = Math.round(CROP_REGION.h * full.height);

        if (
          !srcCanvasRef.current ||
          srcCanvasRef.current.width !== full.width ||
          srcCanvasRef.current.height !== full.height
        ) {
          srcCanvasRef.current = document.createElement('canvas');
          srcCanvasRef.current.width = full.width;
          srcCanvasRef.current.height = full.height;
        }
        if (
          !cropCanvasRef.current ||
          cropCanvasRef.current.width !== sw ||
          cropCanvasRef.current.height !== sh
        ) {
          cropCanvasRef.current = document.createElement('canvas');
          cropCanvasRef.current.width = sw;
          cropCanvasRef.current.height = sh;
        }

        const srcCtx = srcCanvasRef.current.getContext('2d');
        const cropCtx = cropCanvasRef.current.getContext('2d');
        if (!srcCtx || !cropCtx) return;

        srcCtx.putImageData(full, 0, 0);
        cropCtx.drawImage(srcCanvasRef.current, sx, sy, sw, sh, 0, 0, sw, sh);
        processFrame(cropCtx.getImageData(0, 0, sw, sh));

        setInferringRef.current(true);
        if (inferTimerRefRef.current.current) clearTimeout(inferTimerRefRef.current.current);
        inferTimerRefRef.current.current = setTimeout(() => setInferringRef.current(false), 300);
      } catch {
        /* camera not ready */
      }
    }, captureIntervalMs);
    return () => clearInterval(interval);
  }, [isReady, isActive, captureIntervalMs, processFrame, getImageData, isCameraLoading]);

  const modelColor = fatalError
    ? '#ff4444'
    : isReady
    ? '#44ff88'
    : isLoading
    ? '#ffaa00'
    : '#888888';
  const inferColor = inferring ? '#44ff88' : '#888888';

  const debugDots = (
    <div
      style={{
        position: 'absolute',
        top: 8,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: modelColor,
              boxShadow: `0 0 6px ${modelColor}`,
            }}
          />
          <span
            style={{
              color: '#fff',
              fontSize: 9,
              fontFamily: 'monospace',
              textShadow: '0 0 3px #000',
            }}
          >
            model
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: inferColor,
              boxShadow: `0 0 6px ${inferColor}`,
            }}
          />
          <span
            style={{
              color: '#fff',
              fontSize: 9,
              fontFamily: 'monospace',
              textShadow: '0 0 3px #000',
            }}
          >
            infer
          </span>
        </div>
      </div>
      {fatalError && (
        <div
          style={{
            color: '#ff4444',
            fontSize: 9,
            fontFamily: 'monospace',
            background: 'rgba(0,0,0,0.8)',
            padding: '2px 6px',
            borderRadius: 3,
            maxWidth: 300,
            wordBreak: 'break-all',
          }}
        >
          {fatalError}
        </div>
      )}
    </div>
  );

  const overlayStyle: React.CSSProperties = previewDimensions
    ? {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: previewDimensions.width,
        height: previewDimensions.height,
        pointerEvents: 'none',
      }
    : { position: 'absolute', inset: 0, pointerEvents: 'none' };

  if (!isActive) return <div style={overlayStyle}>{debugDots}</div>;

  const isConfirmed = confirmedText !== null;
  const displayText = confirmedText ?? (detectedText || null);
  const fillFraction = isConfirmed ? 1 : consistencyCount / appearanceCount;
  const solidColor = isConfirmed ? COLOR_CONFIRMED : COLOR_MATCH;
  const glowColor = isConfirmed ? 'rgba(34,197,94,0.4)' : 'transparent';

  // Compute SVG dimensions from actual rendered crop box pixels so the perimeter is exact.
  const containerW = previewDimensions ? previewDimensions.width : 0;
  const containerH = previewDimensions ? previewDimensions.height : 0;
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

  return (
    <div style={overlayStyle}>
      {debugDots}
      <div
        style={{
          position: 'absolute',
          top: `${CROP_REGION.y * 100}%`,
          left: `${CROP_REGION.x * 100}%`,
          width: `${CROP_REGION.w * 100}%`,
          height: `${CROP_REGION.h * 100}%`,
          pointerEvents: 'none',
          borderRadius: RADIUS,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 8,
          paddingBottom: 10,
          boxShadow: isConfirmed ? `0 0 24px 4px ${glowColor}` : 'none',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        <svg
          viewBox={`0 0 ${boxW} ${boxH}`}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}
          xmlns='http://www.w3.org/2000/svg'
        >
          {/* Dashed idle border — fades out as steps accumulate */}
          <rect
            {...rectProps}
            stroke={COLOR_IDLE}
            strokeWidth={STROKE}
            strokeDasharray='8 6'
            opacity={consistencyCount > 0 || isConfirmed ? 0 : 1}
            style={{ transition: 'opacity 0.3s ease' }}
          />

          {/* Progressive fill — draws around the border, turns green on confirm */}
          <rect
            {...rectProps}
            stroke={solidColor}
            strokeWidth={STROKE}
            strokeDasharray={`${filledLength} ${perimeter}`}
            strokeLinecap='round'
            style={{ transition: 'stroke-dasharray 0.4s ease, stroke 0.3s ease' }}
          />
        </svg>

        {displayText && (
          <div
            style={{
              backgroundColor: isConfirmed ? 'rgba(34,197,94,0.92)' : 'rgba(0,0,0,0.72)',
              color: '#fff',
              padding: '4px 18px',
              borderRadius: 6,
              fontSize: 20,
              fontWeight: 'bold',
              letterSpacing: 4,
              whiteSpace: 'nowrap',
              fontFamily: 'monospace',
              transition: 'background-color 0.3s ease',
              boxShadow: isConfirmed ? '0 2px 12px rgba(34,197,94,0.4)' : 'none',
            }}
          >
            {displayText}
          </div>
        )}

        <div
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: 11,
            letterSpacing: 0.5,
            whiteSpace: 'nowrap',
            textShadow: '0 1px 3px rgba(0,0,0,0.8)',
          }}
        >
          {isConfirmed
            ? '✓ VIN confirmed'
            : consistencyCount > 0
            ? `${consistencyCount} / ${appearanceCount} consistent reads`
            : 'Scanning…'}
        </div>
      </div>
    </div>
  );
}
