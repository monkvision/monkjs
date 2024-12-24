import { InteractiveStatus, Styles } from '@monkvision/types';
import { CSSProperties, useState } from 'react';
import {
  getInteractiveVariants,
  InteractiveVariation,
  useInterval,
  useIsMounted,
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
const RECORDING_ANIMATION_DURATION_MS = 1200;

export const styles: Styles = {
  button: {
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
};

interface RecordVideoButtonStyleParams
  extends Required<Pick<MonkRecordVideoButtonProps, 'size' | 'isRecording'>> {
  status: InteractiveStatus;
}

interface RecordVideoButtonStyles {
  container: CSSProperties;
  innerCircle: CSSProperties;
}

export function useRecordVideoButtonStyles({
  size,
  isRecording,
  status,
}: RecordVideoButtonStyleParams): RecordVideoButtonStyles {
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

  const innerCircleSize = (isRecording ? animationRatio : INNER_CIRCLE_DEFAULT_RATIO) * size;
  const innerCircleBackgroundColor = isRecording
    ? RECORD_VIDEO_BUTTON_RECORDING_COLORS[status]
    : TAKE_PICTURE_BUTTON_COLORS[status];

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
  };
}
