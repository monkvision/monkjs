import { useWindowDimensions } from '@monkvision/common';
import { DeviceOrientation, Styles } from '@monkvision/types';

export const styles: Styles = {
  arrowsContainer: {
    position: 'absolute',
    opacity: 0,
    animation: 'arrowFadeInOut 2s ease-in-out 1s forwards',
    pointerEvents: 'none',
  },
  leftArrow: {
    position: 'absolute',
    top: -25,
    left: 0,
  },
  rightArrow: {
    position: 'absolute',
    bottom: -25,
    right: 0,
    transform: 'rotate(180deg)',
  },
  leftArrowLanscape: {
    transform: 'rotateY(180deg) rotate(80deg)',
  },
  rightArrowLanscape: {
    transform: 'rotateY(180deg) rotate(260deg)',
  },
  phoneOrientation: {
    animation: 'rotateLandscape 1s ease-in-out 2s forwards',
  },
  phoneOrientationPortrait: {
    transform: 'rotate(270deg)',
    animation: 'rotatePortrait 1s ease-in-out 2s forwards',
  },
};

interface PhoneRotationStylesParams {
  orientation: DeviceOrientation;
}

export function usePhoneRotationStyles({ orientation }: PhoneRotationStylesParams) {
  const { height, width, isPortrait } = useWindowDimensions();

  const phoneSize = isPortrait
    ? Math.min(width * 0.7, height * 0.5)
    : Math.min(height * 0.7, width * 0.7);

  return {
    phoneStyle: {
      ...{ height: phoneSize },
      ...(orientation === DeviceOrientation.LANDSCAPE && styles['phoneOrientation']),
      ...(orientation === DeviceOrientation.PORTRAIT && styles['phoneOrientationPortrait']),
    },
    arrowsStyle: {
      ...styles['arrowsContainer'],
      width: phoneSize,
      height: phoneSize,
    },
    arrowLeftStyle: {
      ...styles['leftArrow'],
      ...(orientation === DeviceOrientation.LANDSCAPE && styles['leftArrowLanscape']),
    },
    arrowRightStyle: {
      ...styles['rightArrow'],
      ...(orientation === DeviceOrientation.LANDSCAPE && styles['rightArrowLanscape']),
    },
  };
}
