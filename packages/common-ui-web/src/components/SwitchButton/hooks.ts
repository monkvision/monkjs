import { CSSProperties, useMemo } from 'react';
import { useMonkTheme, changeAlpha } from '@monkvision/common';
import { ColorProp, InteractiveColors, InteractiveStatus } from '@monkvision/types';
import { sizes, styles } from './SwitchButton.styles';

/**
 * The size of a SwitchButton.
 */
export type SwitchButtonSize = 'normal' | 'small';

/**
 * Props accepted by the SwitchButton component.
 */
export interface SwitchButtonProps {
  /**
   * The size of the button. Normal buttons are bigger and have their icon and labels inside the button. Small buttons
   * are smaller, accept no label and have their icon inside the knob.
   *
   * @default 'normal'
   */
  size?: SwitchButtonSize;
  /**
   * Boolean used to control the SwitchButton. Set to `true` to make the Button switched on and `false` for off.
   *
   * @default false
   */
  checked?: boolean;
  /**
   * Callback called when the SwitchButton is switched. The value passed as the first parameter is the result `checked`
   * value.
   */
  onSwitch?: (value: boolean) => void;
  /**
   * Boolean indicating if the button is disabled or not.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * Primary color (background and knob overlay color) of the button when it is checked.
   */
  checkedPrimaryColor?: ColorProp;
  /**
   * Secondary color (knob, labels and icons color) of the button when it is checked.
   */
  checkedSecondaryColor?: ColorProp;
  /**
   * Primary color (background and knob overlay color) of the button when it is unchecked.
   */
  uncheckedPrimaryColor?: ColorProp;
  /**
   * Secondary color (knob, labels and icons color) of the button when it is unchecked.
   */
  uncheckedSecondaryColor?: ColorProp;
  /**
   * Custom label that can be displayed instead of the check icon when the button is checked. This prop is ignored for
   * small buttons.
   *
   * Note : We recommend keeping this label extra short (2 or 3 characters long).
   */
  checkedLabel?: string;
  /**
   * Custom label that can be displayed when the button is unchecked. This prop is ignored for small buttons.
   *
   * Note : We recommend keeping this label extra short (2 or 3 characters long).
   */
  uncheckedLabel?: string;
}

type SwitchButtonStylesParam = Required<
  Pick<
    SwitchButtonProps,
    | 'size'
    | 'checked'
    | 'checkedPrimaryColor'
    | 'checkedSecondaryColor'
    | 'uncheckedPrimaryColor'
    | 'uncheckedSecondaryColor'
  >
> & {
  status: InteractiveStatus;
};

interface SwitchButtonStyles {
  buttonStyle: CSSProperties;
  icon: {
    color: ColorProp;
    size: number;
    style: CSSProperties;
  };
  checkedLabelStyle: CSSProperties;
  uncheckedLabelStyle: CSSProperties;
  knobOverlayStyle: CSSProperties;
  knobStyle: CSSProperties;
  iconSmall: {
    color: ColorProp;
    size: number;
    style: CSSProperties;
  };
}

export function useSwitchButtonStyles(params: SwitchButtonStylesParam): SwitchButtonStyles {
  const { utils } = useMonkTheme();
  const knobOverlayColors: InteractiveColors = useMemo(
    () => ({
      [InteractiveStatus.DEFAULT]: '#00000000',
      [InteractiveStatus.HOVERED]: changeAlpha(utils.getColor(params.checkedPrimaryColor), 0.18),
      [InteractiveStatus.ACTIVE]: changeAlpha(utils.getColor(params.checkedPrimaryColor), 0.3),
      [InteractiveStatus.DISABLED]: '#00000000',
    }),
    [params.checkedPrimaryColor, utils],
  );

  return useMemo(
    () => ({
      buttonStyle: {
        ...styles['button'],
        ...(params.status === InteractiveStatus.DISABLED ? styles['buttonDisabled'] : {}),
        ...(params.size === 'small' ? styles['buttonSmall'] : {}),
        backgroundColor: params.checked
          ? utils.getColor(params.checkedPrimaryColor)
          : utils.getColor(params.uncheckedPrimaryColor),
      },
      icon: {
        color: utils.getColor(params.checkedSecondaryColor),
        size: sizes.normal.iconSize,
        style: {
          ...styles['icon'],
          opacity: params.checked ? 1 : 0,
        },
      },
      checkedLabelStyle: {
        ...styles['label'],
        color: utils.getColor(params.checkedSecondaryColor),
        opacity: params.checked ? 1 : 0,
      },
      uncheckedLabelStyle: {
        ...styles['label'],
        color: utils.getColor(params.uncheckedSecondaryColor),
        opacity: params.checked ? 0 : 1,
      },
      knobOverlayStyle: {
        ...styles['knobOverlay'],
        ...(params.size === 'small' ? styles['knobOverlaySmall'] : {}),
        ...(params.checked ? styles['knobOverlayChecked'] : {}),
        ...(params.checked && params.size === 'small' ? styles['knobOverlaySmallChecked'] : {}),
        backgroundColor: knobOverlayColors[params.status],
      },
      knobStyle: {
        ...styles['knob'],
        ...(params.size === 'small' ? styles['knobSmall'] : {}),
        ...(params.checked ? styles['knobChecked'] : {}),
        ...(params.checked && params.size === 'small' ? styles['knobSmallChecked'] : {}),
        backgroundColor: params.checked
          ? utils.getColor(params.checkedSecondaryColor)
          : utils.getColor(params.uncheckedSecondaryColor),
      },
      iconSmall: {
        color: utils.getColor(params.checkedPrimaryColor),
        size: sizes.small.iconSize,
        style: {
          ...styles['icon'],
          opacity: params.checked ? 1 : 0,
        },
      },
    }),
    [utils, params, knobOverlayColors],
  );
}
