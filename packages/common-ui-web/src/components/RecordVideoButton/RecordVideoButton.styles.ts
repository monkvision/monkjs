import { InteractiveStatus, Styles } from '@monkvision/types';
import { CSSProperties, useMemo, useState } from 'react';
import {
  changeAlpha,
  getInteractiveVariants,
  InteractiveVariation,
  useInterval,
  useIsMounted,
  useMonkTheme,
} from '@monkvision/common';
import { MonkRecordVideoButtonProps } from './RecordVideoButton.types';
import { TAKE_PICTURE_BUTTON_COLORS } from '../TakePictureButton/TakePictureButton.styles';

export const RECORD_VIDEO_BUTTON_RECORDING_COLORS = getInteractiveVariants(
  '#cb0000',
  InteractiveVariation.DARKEN,
);
const BORDER_WIDTH_RATIO = 0.05;
const INNER_CIRCLE_DEFAULT_RATIO = 0.5;
const INNER_CIRCLE_SMALL_RATIO = 0.3;
const INNER_CIRCLE_BIG_RATIO = 0.7;
const TOOLTIP_MAX_WIDTH_RATIO = 2;
const TOOLTIP_ARROW_RATIO = 0.15;
const TOOLTIP_MARGIN_RATIO = 0.1;
const RECORDING_ANIMATION_DURATION_MS = 1200;

export const styles: Styles = {
  button: {
    position: 'relative',
    borderStyle: 'solid',
    borderRadius: '50%',
    cursor: 'pointer',
    boxSizing: 'border-box',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    margin: 0,
  },
  buttonDisabled: {
    opacity: 0.75,
    cursor: 'default',
  },
  innerCircle: {
    borderRadius: '50%',
  },
  tooltip: {
    position: 'absolute',
    zIndex: 2,
    pointerEvents: 'none',
    padding: '10px 6px',
    borderRadius: 5,
    fontSize: 13,
    textAlign: 'center',
    width: 'max-content',
  },
  tooltipArrow: {
    position: 'absolute',
    zIndex: 2,
    pointerEvents: 'none',
    borderStyle: 'solid',
  },
};

interface RecordVideoButtonStyleParams
  extends Required<Pick<MonkRecordVideoButtonProps, 'size' | 'isRecording' | 'tooltipPosition'>> {
  status: InteractiveStatus;
}

interface RecordVideoButtonStyles {
  container: CSSProperties;
  innerCircle: CSSProperties;
  tooltipContainer: CSSProperties;
  tooltipArrow: CSSProperties;
}

function getTooltipPosition(
  position: 'up' | 'down' | 'left' | 'right',
  size: number,
  tooltipBg: string,
): { tooltip: CSSProperties; arrow: CSSProperties } {
  switch (position) {
    case 'up':
      return {
        tooltip: {
          top: -size * (BORDER_WIDTH_RATIO + TOOLTIP_ARROW_RATIO + TOOLTIP_MARGIN_RATIO),
          left: -(size * BORDER_WIDTH_RATIO),
          transform: `translateX(calc(${size / 2}px - 50%)) translateY(-100%)`,
        },
        arrow: {
          top: -size * (BORDER_WIDTH_RATIO + TOOLTIP_ARROW_RATIO + TOOLTIP_MARGIN_RATIO),
          borderWidth: size * TOOLTIP_ARROW_RATIO,
          borderColor: `${tooltipBg} transparent transparent transparent`,
        },
      };
    case 'down':
      return {
        tooltip: {
          top: size * (1 - BORDER_WIDTH_RATIO + TOOLTIP_ARROW_RATIO + TOOLTIP_MARGIN_RATIO),
          left: -(size * BORDER_WIDTH_RATIO),
          transform: `translateX(calc(${size / 2}px - 50%))`,
        },
        arrow: {
          top: size * (1 - 2 * BORDER_WIDTH_RATIO),
          borderWidth: size * TOOLTIP_ARROW_RATIO,
          borderColor: `transparent transparent ${tooltipBg} transparent`,
        },
      };
    case 'left':
      return {
        tooltip: {
          top: -(size * BORDER_WIDTH_RATIO),
          left: -size * (BORDER_WIDTH_RATIO + TOOLTIP_ARROW_RATIO + TOOLTIP_MARGIN_RATIO),
          transform: `translateX(-100%) translateY(calc(${size / 2}px - 50%))`,
        },
        arrow: {
          left: -size * (BORDER_WIDTH_RATIO + TOOLTIP_ARROW_RATIO + TOOLTIP_MARGIN_RATIO),
          borderWidth: size * TOOLTIP_ARROW_RATIO,
          borderColor: `transparent transparent transparent ${tooltipBg}`,
        },
      };
    case 'right':
      return {
        tooltip: {
          top: -(size * BORDER_WIDTH_RATIO),
          left: size * (1 - BORDER_WIDTH_RATIO + TOOLTIP_ARROW_RATIO + TOOLTIP_MARGIN_RATIO),
          transform: `translateY(calc(${size / 2}px - 50%))`,
        },
        arrow: {
          left: size * (1 - 2 * BORDER_WIDTH_RATIO),
          borderWidth: size * TOOLTIP_ARROW_RATIO,
          borderColor: `transparent ${tooltipBg} transparent transparent`,
        },
      };
    default:
      return { tooltip: {}, arrow: {} };
  }
}

export function useRecordVideoButtonStyles({
  size,
  isRecording,
  status,
  tooltipPosition,
}: RecordVideoButtonStyleParams): RecordVideoButtonStyles {
  const { palette } = useMonkTheme();
  const [animationRatio, setAnimationRatio] = useState(INNER_CIRCLE_SMALL_RATIO);
  const isMounted = useIsMounted();

  useInterval(
    () => {
      if (isMounted()) {
        setAnimationRatio((value) =>
          value === INNER_CIRCLE_SMALL_RATIO ? INNER_CIRCLE_BIG_RATIO : INNER_CIRCLE_SMALL_RATIO,
        );
      }
    },
    isRecording ? RECORDING_ANIMATION_DURATION_MS : null,
  );

  const colors = useMemo(
    () => ({
      tooltipBg: changeAlpha(palette.surface.dark, 0.5),
    }),
    [],
  );

  const innerCircleSize = (isRecording ? animationRatio : INNER_CIRCLE_DEFAULT_RATIO) * size;
  const innerCircleBackgroundColor = isRecording
    ? RECORD_VIDEO_BUTTON_RECORDING_COLORS[status]
    : TAKE_PICTURE_BUTTON_COLORS[status];
  const position = getTooltipPosition(tooltipPosition, size, colors.tooltipBg);

  return {
    container: {
      ...styles['button'],
      ...(status === InteractiveStatus.DISABLED ? styles['buttonDisabled'] : {}),
      borderWidth: size * BORDER_WIDTH_RATIO,
      borderColor: TAKE_PICTURE_BUTTON_COLORS[status],
      width: size,
      height: size,
    },
    innerCircle: {
      ...styles['innerCircle'],
      backgroundColor: innerCircleBackgroundColor,
      width: innerCircleSize,
      height: innerCircleSize,
      transition: isRecording
        ? `width ${RECORDING_ANIMATION_DURATION_MS}ms linear, height ${RECORDING_ANIMATION_DURATION_MS}ms linear`
        : '',
    },
    tooltipContainer: {
      ...styles['tooltip'],
      ...position.tooltip,
      backgroundColor: colors.tooltipBg,
      color: palette.surface.light,
      maxWidth: size * TOOLTIP_MAX_WIDTH_RATIO,
    },
    tooltipArrow: {
      ...styles['tooltipArrow'],
      ...position.arrow,
    },
  };
}
