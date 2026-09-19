import { useMonkTheme } from '@monkvision/common';
import {
  BAND_CAP_RATIO,
  BAND_STROKE_PX,
  DEBUG_BOX_STROKE_PX,
  DEBUG_RAW_BOX_COLOR,
  VEHICLE_BOX_STROKE_PX,
} from '../constants';
import { CenterBox, VehicleDetection, VehiclePositioningState, VideoContentRect } from '../types';
import { getGuideBox, toCornerBox } from '../utils';
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
   * The current positioning state, which drives the colour of both the band and the vehicle box.
   */
  state: VehiclePositioningState;
  /**
   * The EMA-smoothed vehicle box, drawn whenever a vehicle is tracked.
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
 * Builds the SVG path of the guide band, in frame pixels : two horizontal lines with short inward caps at their ends.
 *
 * The band is drawn open at the sides, with no vertical stroke joining the two lines, because that is exactly what the
 * rule it represents says. Only the vehicle's height is judged; its length is expected to overrun the frame at
 * broadside angles. A closed rectangle would promise the opposite and send the user walking backwards.
 *
 * @param box The guide band, in normalized frame coordinates.
 * @param frameWidth The intrinsic width of the camera frames, in pixels.
 * @param frameHeight The intrinsic height of the camera frames, in pixels.
 * @return The SVG path data of the band.
 */
function getBandPath(box: CenterBox, frameWidth: number, frameHeight: number): string {
  const { x, y, width, height } = toCornerBox(box);
  const left = x * frameWidth;
  const top = y * frameHeight;
  const right = left + width * frameWidth;
  const bottom = top + height * frameHeight;
  // A single cap length in frame pixels, so that the caps stay square whatever the aspect ratio of the frame is.
  const cap = BAND_CAP_RATIO * Math.min(frameWidth, frameHeight);

  return [
    `M ${left} ${top + cap} L ${left} ${top} L ${right} ${top} L ${right} ${top + cap}`,
    `M ${left} ${bottom - cap} L ${left} ${bottom} L ${right} ${bottom} L ${right} ${bottom - cap}`,
  ].join(' ');
}

/**
 * Component drawing the vehicle positioning guidance on top of the camera preview : the guide band the vehicle's
 * height should span, the tracked vehicle box, a scrim over the letterbox bars, and the raw model output when debug
 * mode is enabled.
 *
 * The band is derived from the frame dimensions rather than passed in, so that what is drawn and what is measured
 * cannot drift apart : both call `getGuideBox`.
 *
 * The SVG is positioned exactly over the painted video rectangle and given a `viewBox` in intrinsic camera pixels, so
 * normalized coordinates can be drawn by simply scaling them by the frame dimensions, with no manual pixel mapping.
 * The `viewBox` deliberately keeps the frame's aspect ratio rather than stretching to the element: a non-uniform
 * scale would make the band caps different lengths on the two axes.
 */
export function VehiclePositioningOverlay({
  contentRect,
  state,
  smoothedBox,
  rawDetections,
  isDebugEnabled,
}: VehiclePositioningOverlayProps) {
  const { palette } = useMonkTheme();
  const { offsetX, offsetY, width, height, frameWidth, frameHeight } = contentRect;
  const guideBox = getGuideBox({ width: frameWidth, height: frameHeight });

  // Both the band and the vehicle box share this colour: the success state has to be unmistakable, because the
  // haptic confirmation is unavailable on iOS.
  const stateColor = {
    [VehiclePositioningState.NO_CAR_DETECTED]: palette.text.secondary,
    [VehiclePositioningState.MOVE_CLOSER]: palette.caution.base,
    [VehiclePositioningState.MOVE_FURTHER_AWAY]: palette.caution.base,
    [VehiclePositioningState.CENTER_THE_CAR]: palette.caution.base,
    [VehiclePositioningState.PERFECT]: palette.success.base,
  }[state];

  const vehicle = smoothedBox ? toCornerBox(smoothedBox) : null;

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
        <path
          d={getBandPath(guideBox, frameWidth, frameHeight)}
          fill='none'
          stroke={stateColor}
          strokeWidth={BAND_STROKE_PX}
          strokeLinecap='round'
          strokeLinejoin='round'
          // Keeps the stroke a constant number of CSS pixels, whatever the intrinsic resolution of the stream is.
          vectorEffect='non-scaling-stroke'
        />
        {vehicle && (
          <rect
            x={vehicle.x * frameWidth}
            y={vehicle.y * frameHeight}
            width={vehicle.width * frameWidth}
            height={vehicle.height * frameHeight}
            fill='none'
            stroke={stateColor}
            strokeWidth={VEHICLE_BOX_STROKE_PX}
            strokeDasharray='10 8'
            vectorEffect='non-scaling-stroke'
          />
        )}
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
      </svg>
    </>
  );
}
