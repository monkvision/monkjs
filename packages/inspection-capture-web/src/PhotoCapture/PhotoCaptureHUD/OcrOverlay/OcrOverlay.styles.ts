import { CSSProperties } from 'react';

export const CROP_REGION = { x: 0.2, y: 0.4, w: 0.6, h: 0.2 };
export const RADIUS = 6;
export const STROKE = 2.5;

export const COLOR_IDLE = 'rgba(255,255,255,0.5)';
export const COLOR_CONFIRMED = '#22c55e';

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

export const styles = {
  debugDots: {
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
  } as CSSProperties,

  debugDotsRow: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  } as CSSProperties,

  debugDotItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  } as CSSProperties,

  debugDotLabel: {
    color: '#fff',
    fontSize: 9,
    fontFamily: 'monospace',
    textShadow: '0 0 3px #000',
  } as CSSProperties,

  debugDotDot: (color: string): CSSProperties => ({
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: color,
    boxShadow: `0 0 6px ${color}`,
  }),

  errorText: {
    color: '#ff4444',
    fontSize: 9,
    fontFamily: 'monospace',
    background: 'rgba(0,0,0,0.8)',
    padding: '2px 6px',
    borderRadius: 3,
    maxWidth: 300,
    wordBreak: 'break-all',
  } as CSSProperties,

  cropBox: {
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
  } as CSSProperties,

  svg: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    overflow: 'visible',
  } as CSSProperties,

  detectedText: (isConfirmed: boolean): CSSProperties => ({
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
  }),

  statusLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    letterSpacing: 0.5,
    whiteSpace: 'nowrap',
    textShadow: '0 1px 3px rgba(0,0,0,0.8)',
  } as CSSProperties,

  shutterHint: {
    position: 'absolute',
    top: `${(CROP_REGION.y + CROP_REGION.h + 0.05) * 100}%`,
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
  } as CSSProperties,
};
