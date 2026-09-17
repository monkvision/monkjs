import { changeAlpha, useMonkTheme, useResponsiveStyle } from '@monkvision/common';
import {
  DETECTOR_ERROR_MESSAGE,
  DETECTOR_LOADING_MESSAGE,
  POSITIONING_INSTRUCTIONS,
} from '../constants';
import { DetectorStatus, VehiclePositioningState } from '../types';
import { styles } from './VehicleInstructionBanner.styles';

/**
 * Props accepted by the VehicleInstructionBanner component.
 */
export interface VehicleInstructionBannerProps {
  /**
   * The current positioning state.
   */
  state: VehiclePositioningState;
  /**
   * The status of the object detector. While it is not ready, a loading message is shown instead of an instruction.
   */
  detectorStatus: DetectorStatus;
}

/**
 * Component displaying the instruction matching the current positioning state.
 *
 * The text is rendered as HTML rather than as an SVG `<text>` element on purpose : inside the overlay's `viewBox`,
 * font sizes would be expressed in intrinsic camera pixels, which makes every dimension device dependent and rules
 * out the responsive styling helpers.
 *
 * Note: This POC does not go through i18n. The strings live in `constants.ts` and would need to be added to all of
 * the package's locale files before this could ship as a real feature.
 */
export function VehicleInstructionBanner({ state, detectorStatus }: VehicleInstructionBannerProps) {
  const { palette } = useMonkTheme();
  const { responsive } = useResponsiveStyle();

  // While the runtime and the model are still downloading, showing "no vehicle detected" would assert that we looked
  // and found nothing, which is not true yet, and a cold start can take a while on a slow connection.
  const isReady = detectorStatus === DetectorStatus.READY;
  const message = {
    [DetectorStatus.LOADING]: DETECTOR_LOADING_MESSAGE,
    [DetectorStatus.ERROR]: DETECTOR_ERROR_MESSAGE,
    [DetectorStatus.READY]: POSITIONING_INSTRUCTIONS[state],
  }[detectorStatus];

  const isPerfect = isReady && state === VehiclePositioningState.PERFECT;
  const color = isPerfect ? palette.text.black : palette.text.primary;
  const backgroundColor = isPerfect
    ? palette.success.base
    : changeAlpha(palette.background.dark, 0.72);

  return (
    <div style={styles['container']}>
      <div
        style={{
          ...styles['banner'],
          ...responsive(styles['bannerPortrait']),
          color,
          backgroundColor,
        }}
        data-testid='vehicle-instruction-banner'
      >
        {message}
      </div>
    </div>
  );
}
