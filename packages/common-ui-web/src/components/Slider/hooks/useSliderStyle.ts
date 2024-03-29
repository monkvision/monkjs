import { CSSProperties, useMemo } from 'react';
import { ColorProp, InteractiveStatus } from '@monkvision/types';
import { useMonkTheme } from '@monkvision/common';
import { styles } from '../Slider.styles';

/**
 * Props that the Slider component can accept.
 */
export interface SliderProps {
  /**
   * The minimum value of the slider.
   *
   * @default 0
   */
  min?: number;

  /**
   * The maximum value of the slider.
   *
   * @default 100
   */
  max?: number;

  /**
   * The current value of the slider.
   *
   * @default (max - min) / 2
   */
  value?: number;

  /**
   * The primary color used for the thumb/knob border .
   *
   * @default 'primary'
   */
  primaryColor?: ColorProp;

  /**
   * The secondary color used for the progress bar, growing depending on the value / thumb position.
   *
   * @default 'primary'
   */
  secondaryColor?: ColorProp;

  /**
   * The tertiary color used for the track bar background of the slider.
   *
   * @default 'secondary-xlight'
   */
  tertiaryColor?: ColorProp;

  /**
   * Determines if the slider is disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * The increment value of the slider.
   *
   * @default 1
   */
  step?: number;

  /**
   * Callback function invoked when the slider value changes.
   * @param value - The new value of the slider.
   */
  onChange?: (value: number) => void;

  /**
   * Optional styling: `style` property allows custom CSS styles for the slider.
   * `width` sets slider width; `height` has no effect.
   */
  style?: CSSProperties;
}

type SliderStylesParams = Required<
  Pick<SliderProps, 'primaryColor' | 'secondaryColor' | 'tertiaryColor'>
> & {
  status: InteractiveStatus;
  style?: CSSProperties;
};

/**
 * Custom hook for generating styles for the Slider component based on provided parameters.
 * @param params - Parameters for generating Slider styles.
 * @returns SliderStyles object containing CSS properties for various slider elements.
 */
export function useSliderStyle(params: SliderStylesParams) {
  const { utils } = useMonkTheme();
  const { primary, secondary, tertiary } = {
    primary: utils.getColor(params.primaryColor),
    secondary: utils.getColor(params.secondaryColor),
    tertiary: utils.getColor(params.tertiaryColor),
  };

  return useMemo(() => {
    return {
      sliderStyle: {
        ...styles['sliderStyle'],
        ...params.style,
        ...(params.status === InteractiveStatus.DISABLED ? styles['sliderDisabled'] : {}),
      },
      trackBarStyle: {
        ...styles['trackBarStyle'],
        background: tertiary,
      },
      thumbStyle: {
        ...styles['thumbStyle'],
        ...(params.status === InteractiveStatus.DISABLED ? { cursor: 'default' } : {}),
        borderColor: primary,
      },
      progressBarStyle: {
        ...styles['progressBarStyle'],
        background: secondary,
      },
      hoverThumbStyle: {
        ...styles['thumbStyle'],
        ...styles['hoverStyle'],
        ...([InteractiveStatus.HOVERED, InteractiveStatus.ACTIVE].includes(params.status)
          ? styles['hovered']
          : {}),
      },
    };
  }, [params, utils]);
}
