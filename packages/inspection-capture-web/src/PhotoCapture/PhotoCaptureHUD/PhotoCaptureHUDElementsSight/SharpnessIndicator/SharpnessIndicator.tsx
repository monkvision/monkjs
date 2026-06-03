import { CSSProperties } from 'react';

/**
 * Props of the SharpnessIndicator component.
 */
export interface SharpnessIndicatorProps {
  /** Whether the current video frame is sharp enough to capture. */
  isSharp: boolean;
  /** Whether the sharpness gate was bypassed by the 5s safety timeout. */
  timedOut: boolean;
}

/**
 * Small overlay badge displayed on close-up sights (e.g. penny-test).
 * Shows "Hold still…" when the frame is blurry, "✓ Ready" when sharp.
 * After the 5s safety timeout fires, shows "Try to hold still".
 */
export function SharpnessIndicator({ isSharp, timedOut }: SharpnessIndicatorProps) {
  const label = timedOut ? 'Try to hold still' : isSharp ? '✓ Ready' : 'Hold still…';

  const badgeStyle: CSSProperties = {
    position: 'absolute',
    bottom: 100,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: '8px 16px',
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  };

  const dotStyle: CSSProperties = {
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: isSharp ? '#7ED321' : '#F5A623',
    transition: 'background-color 0.3s ease',
  };

  const labelStyle: CSSProperties = {
    fontSize: 14,
    fontWeight: 600,
    color: 'white',
  };

  return (
    <div style={badgeStyle}>
      <div style={dotStyle} />
      <span style={labelStyle}>{label}</span>
    </div>
  );
}
