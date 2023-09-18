import { useMonkTheme } from '@monkvision/common';
import { ColorProp } from '@monkvision/types';
import { CSSProperties, HTMLAttributes, useMemo } from 'react';

/**
 * Props that can be passed to the spinner component.
 */
export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The size of the spinner (width and height, in pixels). The width of the spinner line is scaled accordingly.
   *
   * @default 50
   */
  size?: number;
  /**
   * The name or hexcode of the spinner's color.
   *
   * @default text-white
   */
  primaryColor?: ColorProp;
}

interface SpinnerStyles {
  spinner: CSSProperties;
  container: CSSProperties;
  layer1: CSSProperties;
  layer2: CSSProperties;
}

export function useSpinnerStyle({
  size = 50,
  primaryColor = 'text-white',
}: SpinnerProps): SpinnerStyles {
  const { utils } = useMonkTheme();
  return useMemo(() => {
    const color = utils.getColor(primaryColor);
    return {
      spinner: {
        width: size,
        height: size,
      },
      container: {
        width: size,
        height: size,
      },
      layer1: {
        width: size,
        height: size,
        clip: `rect(0, ${size}px, ${size}px, ${size / 2}px)`,
      },
      layer2: {
        borderColor: color,
        borderWidth: size / 10,
        width: size,
        height: size,
        clip: `rect(0, ${size}px, ${size}px, ${size / 2}px)`,
      },
    };
  }, [size, primaryColor, utils]);
}
