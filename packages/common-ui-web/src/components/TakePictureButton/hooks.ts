import { ButtonHTMLAttributes, CSSProperties, useMemo } from 'react';

export interface TakePictureButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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

const INNER_BUTTON_SIZE_RATIO = 0.84;

export function useTakePictureButtonStyle({
  size = 60,
}: Partial<TakePictureButtonProps>): TakePictureButtonStyles {
  const borderWidth = (size * (1 - INNER_BUTTON_SIZE_RATIO)) / 4;

  return useMemo(() => {
    return {
      outerLayer: {
        width: size - 2 * borderWidth,
        height: size - 2 * borderWidth,
        borderWidth,
      },
      innerLayer: {
        width: size * INNER_BUTTON_SIZE_RATIO,
        height: size * INNER_BUTTON_SIZE_RATIO,
        margin: borderWidth,
      },
    };
  }, [size]);
}
