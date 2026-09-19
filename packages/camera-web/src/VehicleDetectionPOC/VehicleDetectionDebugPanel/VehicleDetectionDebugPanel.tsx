import { useMonkTheme } from '@monkvision/common';
import {
  HORIZONTAL_CENTER_ENTER,
  VERTICAL_CENTER_ENTER,
  VERTICAL_FILL_ENTER_MIN,
} from '../constants';
import {
  DetectorDelegate,
  DetectorStatus,
  PositioningMetrics,
  VehiclePositioningState,
  VideoContentRect,
} from '../types';
import { getInferenceDimensions } from '../utils';
import { styles } from './VehicleDetectionDebugPanel.styles';

/**
 * Props accepted by the VehicleDetectionDebugPanel component.
 */
export interface VehicleDetectionDebugPanelProps {
  /**
   * The current positioning state.
   */
  state: VehiclePositioningState;
  /**
   * The status of the object detector.
   */
  detectorStatus: DetectorStatus;
  /**
   * The delegate the detector is running on.
   */
  delegate: DetectorDelegate.CPU | DetectorDelegate.GPU | null;
  /**
   * The live positioning metrics, or null if no vehicle is tracked.
   */
  metrics: PositioningMetrics | null;
  /**
   * How long the last inference call took, in milliseconds.
   */
  inferenceMs: number;
  /**
   * The number of vehicle candidates returned by the last tick.
   */
  candidateCount: number;
  /**
   * The painted content rectangle, used to report the source resolution.
   */
  contentRect: VideoContentRect | null;
  /**
   * The width the frames are downscaled to before inference.
   */
  inferenceWidth: number | null;
}

/**
 * Component displaying the live internals of the positioning state machine, so that QA and R&D can see why a given
 * state is being produced instead of having to guess at the maths.
 *
 * The inference cost and the effective frame rate are the most valuable numbers here : they are what determines
 * whether this approach is viable on a given class of device.
 */
export function VehicleDetectionDebugPanel({
  state,
  detectorStatus,
  delegate,
  metrics,
  inferenceMs,
  candidateCount,
  contentRect,
  inferenceWidth,
}: VehicleDetectionDebugPanelProps) {
  const { palette } = useMonkTheme();
  const source = contentRect
    ? { width: contentRect.frameWidth, height: contentRect.frameHeight }
    : null;
  const inference = source ? getInferenceDimensions(source, inferenceWidth) : null;

  const rows: [string, string][] = [
    ['state', state],
    ['detector', `${detectorStatus}${delegate ? ` (${delegate})` : ''}`],
    ['v-fill', metrics ? `${metrics.verticalFill.toFixed(3)} / >${VERTICAL_FILL_ENTER_MIN}` : '—'],
    [
      'v-center',
      metrics ? `${metrics.verticalCenterError.toFixed(3)} / <${VERTICAL_CENTER_ENTER}` : '—',
    ],
    [
      'h-center',
      metrics ? `${metrics.horizontalCenterError.toFixed(3)} / <${HORIZONTAL_CENTER_ENTER}` : '—',
    ],
    // The exact "too close" test: both clipped means the full height of the vehicle is no longer visible.
    [
      'clipped',
      metrics
        ? `${metrics.isTopClipped ? 'roof' : '—'} / ${metrics.isBottomClipped ? 'wheels' : '—'}`
        : '—',
    ],
    ['candidates', String(candidateCount)],
    ['inference', `${inferenceMs.toFixed(1)}ms`],
    [
      'resolution',
      source && inference
        ? `${source.width}x${source.height} -> ${inference.width}x${inference.height}`
        : '—',
    ],
  ];

  return (
    <div
      style={{ ...styles['panel'], color: palette.text.primary }}
      data-testid='vehicle-detection-debug-panel'
    >
      {rows.map(([label, value]) => (
        <div key={label} style={styles['row']}>
          <span style={styles['label']}>{label}</span>
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
}
