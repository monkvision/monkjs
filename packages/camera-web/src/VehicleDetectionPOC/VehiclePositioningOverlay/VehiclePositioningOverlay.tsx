import { useMonkTheme } from '@monkvision/common';
import {
  CORNER_RADIUS_RATIO,
  DEBUG_BOX_STROKE_PX,
  DEBUG_RAW_BOX_COLOR,
  DEBUG_SMOOTHED_BOX_COLOR,
  TARGET_FRAME_STROKE_PX,
} from '../constants';
import { CenterBox, VehicleDetection, VehiclePositioningState, VideoContentRect } from '../types';
import { toCornerBox } from '../utils';
import { styles } from './VehiclePositioningOverlay.styles';

/**
 * Props accepted by the VehiclePositioningOverlay component.
 */
export interface VehiclePositioningOverlayProps {
  /**
   * The rectangle actually painted by the camera preview, which the overlay is sized and positioned to match.
   */
  contentRect: VideoContentRect;
  /**
   * The current positioning state, which drives the colour of the target frame.
   */
  state: VehiclePositioningState;
  /**
   * The static target frame, in normalized frame coordinates.
   */
  targetBox: CenterBox;
  /**
   * The EMA-smoothed vehicle box, only drawn in debug mode.
   */
  smoothedBox: CenterBox | null;
  /**
   * The raw, unsmoothed model output, only drawn in debug mode.
   */
  rawDetections: VehicleDetection[];
  /**
   * Whether the debug boxes should be drawn.
   */
  isDebugEnabled: boolean;
}

/**
 * Component drawing the vehicle positioning guidance on top of the camera preview : the target frame the user should
 * fill, a scrim over the letterbox bars, and the model output when debug mode is enabled.
 *
 * The SVG is positioned exactly over the painted video rectangle and given a `viewBox` in intrinsic camera pixels, so
 * normalized coordinates can be drawn by simply scaling them by the frame dimensions, with no manual pixel mapping.
 * The `viewBox` deliberately keeps the frame's aspect ratio rather than stretching to the element: a non-uniform
 * scale would turn every rounded corner into an ellipse.
 */
export function VehiclePositioningOverlay({
  contentRect,
  state,
  targetBox,
  smoothedBox,
  rawDetections,
  isDebugEnabled,
}: VehiclePositioningOverlayProps) {
  const { palette } = useMonkTheme();
  const { offsetX, offsetY, width, height, frameWidth, frameHeight } = contentRect;
  const target = toCornerBox(targetBox);
  const cornerRadius = CORNER_RADIUS_RATIO * Math.min(frameWidth, frameHeight);

  const frameColor = {
    [VehiclePositioningState.NO_CAR_DETECTED]: palette.text.secondary,
    [VehiclePositioningState.MOVE_CLOSER]: palette.caution.base,
    [VehiclePositioningState.MOVE_FURTHER_AWAY]: palette.caution.base,
    [VehiclePositioningState.CENTER_THE_CAR]: palette.caution.base,
    [VehiclePositioningState.PERFECT]: palette.success.base,
  }[state];

  return (
    <>
      {/* Dims the letterbox bars, so that the user reads the painted rectangle as the active area rather than
          assuming the whole screen is being analysed. */}
      <div style={{ ...styles['scrim'], top: 0, left: 0, right: 0, height: offsetY }} />
      <div style={{ ...styles['scrim'], top: offsetY + height, left: 0, right: 0, bottom: 0 }} />
      <div style={{ ...styles['scrim'], top: offsetY, left: 0, width: offsetX, height }} />
      <div style={{ ...styles['scrim'], top: offsetY, left: offsetX + width, right: 0, height }} />
      <svg
        style={{ ...styles['overlay'], top: offsetY, left: offsetX, width, height }}
        viewBox={`0 0 ${frameWidth} ${frameHeight}`}
        preserveAspectRatio='xMidYMid meet'
        shapeRendering='geometricPrecision'
        data-testid='vehicle-positioning-overlay'
      >
        <rect
          x={target.x * frameWidth}
          y={target.y * frameHeight}
          width={target.width * frameWidth}
          height={target.height * frameHeight}
          rx={cornerRadius}
          ry={cornerRadius}
          fill='none'
          stroke={frameColor}
          strokeWidth={TARGET_FRAME_STROKE_PX}
          strokeLinejoin='round'
          // Keeps the stroke a constant number of CSS pixels, whatever the intrinsic resolution of the stream is.
          vectorEffect='non-scaling-stroke'
        />
        {isDebugEnabled &&
          rawDetections.map(({ box, score, categoryName }, index) => {
            const raw = toCornerBox(box);
            return (
              // eslint-disable-next-line react/no-array-index-key
              <g key={`${categoryName}-${index}`}>
                <rect
                  x={raw.x * frameWidth}
                  y={raw.y * frameHeight}
                  width={raw.width * frameWidth}
                  height={raw.height * frameHeight}
                  fill='none'
                  stroke={DEBUG_RAW_BOX_COLOR}
                  strokeWidth={DEBUG_BOX_STROKE_PX}
                  vectorEffect='non-scaling-stroke'
                />
                <text
                  x={raw.x * frameWidth}
                  y={raw.y * frameHeight - 0.008 * frameHeight}
                  fill={DEBUG_RAW_BOX_COLOR}
                  fontSize={0.03 * frameHeight}
                >
                  {`${categoryName} ${score.toFixed(2)}`}
                </text>
              </g>
            );
          })}
        {isDebugEnabled && smoothedBox && (
          <rect
            x={toCornerBox(smoothedBox).x * frameWidth}
            y={toCornerBox(smoothedBox).y * frameHeight}
            width={smoothedBox.width * frameWidth}
            height={smoothedBox.height * frameHeight}
            fill='none'
            stroke={DEBUG_SMOOTHED_BOX_COLOR}
            strokeWidth={DEBUG_BOX_STROKE_PX}
            strokeDasharray='8 6'
            vectorEffect='non-scaling-stroke'
          />
        )}
      </svg>
    </>
  );
}
