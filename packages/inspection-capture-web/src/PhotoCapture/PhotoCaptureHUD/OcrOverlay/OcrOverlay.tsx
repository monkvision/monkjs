import { useEffect, useRef, useState } from 'react';
import { useOcr, OCR_STABILIZER_CONFIG } from '@monkvision/ml-web';
import { PhotoCaptureOcrConfig } from '../../hooks';

// Normalized crop region [0,1] applied to both the visual box and the ML input.
const CROP_REGION = { x: 0.2, y: 0.40, w: 0.6, h: 0.20 };

export interface OcrOverlayProps {
  config: PhotoCaptureOcrConfig;
  getImageData: () => ImageData;
  isCameraLoading: boolean;
  /**
   * When false the inference loop is paused but the model stays loaded.
   * Set to true only when the VIN sight is active.
   */
  isActive: boolean;
}

export function OcrOverlay({ config, getImageData, isCameraLoading, isActive }: OcrOverlayProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { captureIntervalMs = OCR_STABILIZER_CONFIG.captureIntervalMs, activeSightId: _a, appearanceCount = OCR_STABILIZER_CONFIG.appearanceCount, ...ocrConfig } = config;
  const { isReady, isLoading, fatalError, loadModels, processFrame, confirmedText, detectedText, consistencyCount } =
    useOcr({ ...ocrConfig, appearanceCount });

  // Persistent canvases — never recreated, avoids OOM from per-tick allocations.
  const cropCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const srcCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Debug: flash when a frame is dispatched to the worker.
  const [inferring, setInferring] = useState(false);
  const inferTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setInferringRef = useRef(setInferring);
  const inferTimerRefRef = useRef(inferTimerRef);

  // Load once on mount; model stays alive for the whole session.
  useEffect(() => {
    loadModels();
  }, [loadModels]);

  // Run inference only while the VIN sight is active.
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

        // Flash the infer dot.
        setInferringRef.current(true);
        if (inferTimerRefRef.current.current) clearTimeout(inferTimerRefRef.current.current);
        inferTimerRefRef.current.current = setTimeout(() => setInferringRef.current(false), 300);
      } catch { /* camera not ready */ }
    }, captureIntervalMs);
    return () => clearInterval(interval);
  }, [isReady, isActive, captureIntervalMs, processFrame, getImageData, isCameraLoading]);

  const modelColor = fatalError ? '#ff4444' : isReady ? '#44ff88' : isLoading ? '#ffaa00' : '#888888';
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

  if (!isActive) return debugDots;

  const displayText = confirmedText ?? (detectedText || null);
  const fillPct = confirmedText ? 100 : Math.round((consistencyCount / appearanceCount) * 100);
  const isConfirmed = confirmedText !== null;

  return (
    <>
      {debugDots}
      <div
        style={{
          position: 'absolute',
          top: `${CROP_REGION.y * 100}%`,
          left: `${CROP_REGION.x * 100}%`,
          width: `${CROP_REGION.w * 100}%`,
          height: `${CROP_REGION.h * 100}%`,
          boxSizing: 'border-box',
          border: `2px solid ${isConfirmed ? 'rgba(0, 220, 120, 0.9)' : 'rgba(255, 255, 255, 0.6)'}`,
          borderRadius: 8,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 6,
          paddingBottom: 8,
        }}
      >
        {displayText && (
          <div
            style={{
              backgroundColor: isConfirmed ? 'rgba(0, 180, 100, 0.9)' : 'rgba(0, 0, 0, 0.7)',
              color: '#fff',
              padding: '4px 16px',
              borderRadius: 6,
              fontSize: 18,
              fontWeight: 'bold',
              letterSpacing: 3,
              whiteSpace: 'nowrap',
              fontFamily: 'monospace',
            }}
          >
            {displayText}
          </div>
        )}
        <div
          style={{
            width: '60%',
            height: 4,
            borderRadius: 2,
            backgroundColor: 'rgba(255,255,255,0.25)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${fillPct}%`,
              borderRadius: 2,
              backgroundColor: isConfirmed ? 'rgba(0, 220, 120, 1)' : 'rgba(255, 255, 255, 0.9)',
              transition: 'width 0.25s ease, background-color 0.3s ease',
            }}
          />
        </div>
        <div
          style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: 11,
            letterSpacing: 0.5,
            whiteSpace: 'nowrap',
          }}
        >
          {isConfirmed ? '✓ VIN confirmed' : consistencyCount > 0 ? `${consistencyCount} / ${appearanceCount} consistent reads` : 'Scanning…'}
        </div>
      </div>
    </>
  );
}
