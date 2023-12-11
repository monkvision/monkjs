import { InteractiveStatus } from '@monkvision/types';
import { CSSProperties, useState } from 'react';
import { styles, takePictureButtonColors } from './TakePictureButton.styles';

/**
 * Additional props that can be passed to the TakePictureButton component.
 */
export interface MonkTakePictureButtonProps {
  /**
   * This size includes the center circle + the outer rim, not just the circle at the middle.
   *
   * @default 60
   */
  size?: number;
}

interface TakePictureButtonStyles {
  buttonStyles: {
    innerLayer: CSSProperties;
    outerLayer: CSSProperties;
  };
  animateClick: () => void;
}

interface MonkTakePictureButtonStyleParams extends Required<MonkTakePictureButtonProps> {
  status: InteractiveStatus;
}

const INNER_BUTTON_SIZE_RATIO = 0.84;
const PRESS_ANIMATION_DURATION_MS = 150;

export function useTakePictureButtonStyle(
  params: MonkTakePictureButtonStyleParams,
): TakePictureButtonStyles {
  const [isPressed, setIsPressed] = useState(false);
  const borderWidth = (params.size * (1 - INNER_BUTTON_SIZE_RATIO)) / 4;

  const animateClick = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), PRESS_ANIMATION_DURATION_MS);
  };

  const buttonStyles = {
    outerLayer: {
      ...styles['outerLayer'],
      ...(params.status === InteractiveStatus.DISABLED ? styles['outerLayerDisabled'] : {}),
      width: params.size - 2 * borderWidth,
      height: params.size - 2 * borderWidth,
      borderWidth,
      borderColor: takePictureButtonColors[InteractiveStatus.DEFAULT],
    },
    innerLayer: {
      ...styles['innerLayer'],
      ...(params.status === InteractiveStatus.DISABLED ? styles['innerLayerDisabled'] : {}),
      width: params.size * INNER_BUTTON_SIZE_RATIO,
      height: params.size * INNER_BUTTON_SIZE_RATIO,
      margin: borderWidth,
      backgroundColor: takePictureButtonColors[params.status],
      border: 'none',
      transform: isPressed ? 'scale(0.7)' : 'scale(1)',
      transition: `transform ${PRESS_ANIMATION_DURATION_MS / 2}ms ease-in`,
    },
  };

  return {
    buttonStyles,
    animateClick,
  };
}
