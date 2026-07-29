import React, { useEffect, useRef, useState } from 'react';
import { useOcr, OCR_STABILIZER_CONFIG } from '@monkvision/ml-web';
import { PhotoCaptureOcrConfig } from '../../hooks';

const CROP_REGION = { x: 0.2, y: 0.40, w: 0.6, h: 0.20 };

// SVG viewBox dimensions (aspect ratio matches CROP_REGION)
const VB_W = 300;
const VB_H = 100;
const RADIUS = 10;
const STROKE = 2.5;
// Perimeter of the rounded rect (approx)
const PERIMETER = 2 * (VB_W - 2 * RADIUS) + 2 * (VB_H - 2 * RADIUS) + 2 * Math.PI * RADIUS;

const COLOR_IDLE = 'rgba(255,255,255,0.5)';
const COLOR_MATCH = '#ffffff';
const COLOR_CONFIRMED = '#22c55e';

// Corner L-bracket length as fraction of perimeter
const CORNER_LEN = 18;

export interface OcrOverlayProps {
  config: PhotoCaptureOcrConfig;
  getImageData: () => ImageData;
  isCameraLoading: boolean;
  isActive: boolean;
  /** Actual rendered pixel dimensions of the video content on screen (excluding letterbox bars). */
  previewDimensions: { width: number; height: number } | null;
}

export function OcrOverlay({ config, getImageData, isCameraLoading, isActive, previewDimensions }: OcrOverlayProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { captureIntervalMs = OCR_STABILIZER_CONFIG.captureIntervalMs, activeSightId: _a, appearanceCount = OCR_STABILIZER_CONFIG.appearanceCount, ...ocrConfig } = config;
  const { isReady, isLoading, fatalError, loadModels, processFrame, confirmedText, detectedText, consistencyCount } =
    useOcr({ ...ocrConfig, appearanceCount });

  const cropCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const srcCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [inferring, setInferring] = useState(false);
  const inferTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setInferringRef = useRef(setInferring);
  const inferTimerRefRef = useRef(inferTimerRef);

  useEffect(() => { loadModels(); }, [loadModels]);

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

        if (!srcCanvasRef.current || srcCanvasRef.current.width !== full.width || srcCanvasRef.current.height !== full.height) {
          srcCanvasRef.current = document.createElement('canvas');
          srcCanvasRef.current.width = full.width;
          srcCanvasRef.current.height = full.height;
        }
        if (!cropCanvasRef.current || cropCanvasRef.current.width !== sw || cropCanvasRef.current.height !== sh) {
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
      } catch { /* camera not ready */ }
    }, captureIntervalMs);
    return () => clearInterval(interval);
  }, [isReady, isActive, captureIntervalMs, processFrame, getImageData, isCameraLoading]);

  // Debug dots
  const modelColor = fatalError ? '#ff4444' : isReady ? '#44ff88' : isLoading ? '#ffaa00' : '#888888';
  const inferColor = inferring ? '#44ff88' : '#888888';
  const debugDots = (
    <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, pointerEvents: 'none', zIndex: 9999 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: modelColor, boxShadow: `0 0 6px ${modelColor}` }} />
          <span style={{ color: '#fff', fontSize: 9, fontFamily: 'monospace', textShadow: '0 0 3px #000' }}>model</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: inferColor, boxShadow: `0 0 6px ${inferColor}` }} />
          <span style={{ color: '#fff', fontSize: 9, fontFamily: 'monospace', textShadow: '0 0 3px #000' }}>infer</span>
        </div>
      </div>
      {fatalError && (
        <div style={{ color: '#ff4444', fontSize: 9, fontFamily: 'monospace', background: 'rgba(0,0,0,0.8)', padding: '2px 6px', borderRadius: 3, maxWidth: 300, wordBreak: 'break-all' }}>
          {fatalError}
        </div>
      )}
    </div>
  );

  // Overlay container matches the actual video render area (letterbox-aware).
  // This ensures CROP_REGION fractions align with the pixel region fed to the model.
  const overlayStyle: React.CSSProperties = previewDimensions
    ? { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: previewDimensions.width, height: previewDimensions.height, pointerEvents: 'none' }
    : { position: 'absolute', inset: 0, pointerEvents: 'none' };

  if (!isActive) return <div style={overlayStyle}>{debugDots}</div>;

  const isConfirmed = confirmedText !== null;
  const displayText = confirmedText ?? (detectedText || null);

  // Border fill: 0 steps = dashed idle, 1-3 steps fill progressively
  const fillFraction = isConfirmed ? 1 : consistencyCount / appearanceCount;
  const filledLength = fillFraction * PERIMETER;
  const borderColor = isConfirmed ? COLOR_CONFIRMED : consistencyCount > 0 ? COLOR_MATCH : COLOR_IDLE;
  const glowColor = isConfirmed ? 'rgba(34,197,94,0.4)' : 'transparent';

  // Corner brackets: dash = CORNER_LEN, gap = rest of perimeter, repeated 4 times offset at each corner
  const cornerDash = `${CORNER_LEN} ${PERIMETER / 4 - CORNER_LEN}`;

  // Fill rect: dash = filledLength, gap = rest (hidden)
  const fillDash = filledLength > 0 ? `${filledLength} ${PERIMETER}` : 'none';

  const rectProps = {
    x: STROKE / 2,
    y: STROKE / 2,
    width: VB_W - STROKE,
    height: VB_H - STROKE,
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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 8,
          paddingBottom: 10,
          boxShadow: isConfirmed ? `0 0 0 1px ${COLOR_CONFIRMED}, 0 0 24px 4px ${glowColor}` : 'none',
          borderRadius: RADIUS,
          transition: 'box-shadow 0.3s ease',
        }}
      >
        {/* SVG frame */}
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Dim background fill to darken outside-frame area slightly */}
          <rect {...rectProps} stroke="rgba(0,0,0,0.15)" strokeWidth={1} />

          {/* Dashed idle border (always visible, fades when filling) */}
          <rect
            {...rectProps}
            stroke={COLOR_IDLE}
            strokeWidth={STROKE}
            strokeDasharray="8 6"
            opacity={consistencyCount > 0 || isConfirmed ? 0 : 0.6}
            style={{ transition: 'opacity 0.3s ease' }}
          />

          {/* Corner L-brackets (always visible) */}
          <rect
            {...rectProps}
            stroke={borderColor}
            strokeWidth={STROKE + 0.5}
            strokeDasharray={cornerDash}
            strokeDashoffset={0}
            style={{ transition: 'stroke 0.25s ease' }}
          />
          <rect
            {...rectProps}
            stroke={borderColor}
            strokeWidth={STROKE + 0.5}
            strokeDasharray={cornerDash}
            strokeDashoffset={-(PERIMETER / 4)}
            style={{ transition: 'stroke 0.25s ease' }}
          />
          <rect
            {...rectProps}
            stroke={borderColor}
            strokeWidth={STROKE + 0.5}
            strokeDasharray={cornerDash}
            strokeDashoffset={-(PERIMETER / 2)}
            style={{ transition: 'stroke 0.25s ease' }}
          />
          <rect
            {...rectProps}
            stroke={borderColor}
            strokeWidth={STROKE + 0.5}
            strokeDasharray={cornerDash}
            strokeDashoffset={-(PERIMETER * 3 / 4)}
            style={{ transition: 'stroke 0.25s ease' }}
          />

          {/* Progressive fill — grows with each consistency step */}
          {filledLength > 0 && (
            <rect
              {...rectProps}
              stroke={isConfirmed ? COLOR_CONFIRMED : COLOR_MATCH}
              strokeWidth={STROKE}
              strokeDasharray={fillDash}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.25s ease, stroke 0.3s ease' }}
            />
          )}
        </svg>

        {/* Detected text */}
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

        {/* Status label */}
        <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, letterSpacing: 0.5, whiteSpace: 'nowrap', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
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
