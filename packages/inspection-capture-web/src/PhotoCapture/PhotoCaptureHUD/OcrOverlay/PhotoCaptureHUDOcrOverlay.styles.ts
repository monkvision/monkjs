import { CSSProperties } from 'react';

export const RADIUS = 6;
export const STROKE = 2.5;

export const COLOR_IDLE = 'rgba(255,255,255,0.5)';
export const COLOR_CONFIRMED = '#22c55e';

export function getCropRegion(isPortrait: boolean) {
  // In portrait the preview is tall: use a wider, shorter strip to avoid an oversized box.
  return isPortrait ? { x: 0.05, y: 0.45, w: 0.9, h: 0.1 } : { x: 0.2, y: 0.4, w: 0.6, h: 0.2 };
}

export function getPerimeter(w: number, h: number): number {
  return 2 * (w - 2 * RADIUS) + 2 * (h - 2 * RADIUS) + 2 * Math.PI * RADIUS;
}

export function getOverlayStyle(
  previewDimensions: { width: number; height: number } | null,
): CSSProperties {
  return previewDimensions
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
}

export function getCropBoxStyle(region: ReturnType<typeof getCropRegion>): CSSProperties {
  return {
    position: 'absolute',
    top: `${region.y * 100}%`,
    left: `${region.x * 100}%`,
    width: `${region.w * 100}%`,
    height: `${region.h * 100}%`,
    pointerEvents: 'none',
    borderRadius: RADIUS,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    paddingBottom: 10,
  };
}

export function getShutterHintStyle(region: ReturnType<typeof getCropRegion>): CSSProperties {
  return {
    position: 'absolute',
    top: `${(region.y + region.h + 0.05) * 100}%`,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(0,0,0,0.78)',
    color: '#fff',
    padding: '9px 22px',
    borderRadius: 24,
    fontSize: 13,
    fontWeight: 500,
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
  };
}

interface OcrOverlayStyles {
  svg: CSSProperties;
  rectOpacity: CSSProperties;
  rectDash: CSSProperties;
}

export const styles: OcrOverlayStyles = {
  svg: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    overflow: 'visible',
  },
  rectOpacity: {
    transition: 'opacity 0.3s ease',
  },
  rectDash: {
    transition: 'stroke-dasharray 0.4s ease',
  },
};
