import { CSSProperties, useMemo } from 'react';
import { ColorProp, InteractiveStatus } from '@monkvision/types';
import { useMonkTheme } from '@monkvision/common';
import { styles } from './Slider.styles';

/**
 * Props that the Slider component can accept.
 */
export interface SliderProps {
  /**
   * The minimum value of the slider.
   * @default 0
   */
  min?: number;

  /**
   * The maximum value of the slider.
   * @default 100
   */
  max?: number;

  /**
   * The current value of the slider.
   * @default (max - min) / 2
   */
  value?: number;

  /**
   * The primary color used for the background of the slider.
   * @default 'secondary-xlight'
   */
  primaryColor?: ColorProp;

  /**
   * The secondary color used for the 2nd slider bar, growing depending on the value / thumb position.
   * @default 'primary'
   */
  secondaryColor?: ColorProp;

  /**
   * The tertiary color used for the thumb/knob border .
   * @default 'primary'
   */
  tertiaryColor?: ColorProp;

  /**
   * Determines if the slider is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * The increment value for the slider.
   * @default 1
   */
  step?: number;

  /**
   * Callback function invoked when the slider value changes.
   * @param value - The new value of the slider.
   */
  onChange?: (value: number) => void;

  /**
   * Optional styling
   */
  style?: CSSProperties;
}

/**
 * Parameters required for calculating the styles of the Slider component.
 */
type SliderStylesParams = Required<
  Pick<SliderProps, 'primaryColor' | 'secondaryColor' | 'tertiaryColor' | 'style'>
> & {
  status: InteractiveStatus;
};

/**
 * Styles generated for the Slider component.
 */
export interface SliderStyles {
  sliderStyle: CSSProperties;
  trackStyle: CSSProperties;
  thumbStyle: CSSProperties;
  valueTrackStyle: CSSProperties;
  hoverThumbStyle: CSSProperties;
}

/**
 * Custom hook for generating styles for the Slider component based on provided parameters.
 * @param params - Parameters for generating Slider styles.
 * @returns SliderStyles object containing CSS properties for various slider elements.
 */
export function useSliderStyle(params: SliderStylesParams): SliderStyles {
  const { utils } = useMonkTheme();
  const { primary, secondary, tertiary } = useMemo(
    () => ({
      primary: utils.getColor(params.primaryColor),
      secondary: utils.getColor(params.secondaryColor),
      tertiary: utils.getColor(params.tertiaryColor),
    }),
    [params, utils],
  );

  return useMemo(() => {
    return {
      sliderStyle: {
        ...styles['sliderStyle'],
        ...params.style,
        ...(params.status === InteractiveStatus.DISABLED ? styles['sliderDisabled'] : {}),
      },
      trackStyle: {
        ...styles['sliderBarStyle'],
        background: primary,
      },
      thumbStyle: {
        ...styles['thumbStyle'],
        ...(params.status === InteractiveStatus.DISABLED ? { cursor: 'default' } : {}),
        borderColor: tertiary,
      },
      valueTrackStyle: {
        ...styles['trackStyle'],
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
