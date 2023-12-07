import { InteractiveStatus } from '@monkvision/types';
import { CSSProperties, useMemo } from 'react';
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
  innerLayer: CSSProperties;
  outerLayer: CSSProperties;
}

interface MonkTakePictureButtonStyleParams extends Required<MonkTakePictureButtonProps> {
  status: InteractiveStatus;
}

const INNER_BUTTON_SIZE_RATIO = 0.84;

export function useTakePictureButtonStyle(
  params: MonkTakePictureButtonStyleParams,
): TakePictureButtonStyles {
  const borderWidth = (params.size * (1 - INNER_BUTTON_SIZE_RATIO)) / 4;

  return useMemo(() => {
    return {
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
      },
    };
  }, [params]);
}
