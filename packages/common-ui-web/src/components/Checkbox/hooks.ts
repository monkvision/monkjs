import { ColorProp } from '@monkvision/types';
import { changeAlpha, useMonkTheme } from '@monkvision/common';
import { CSSProperties, useMemo } from 'react';
import { styles } from './Checkbox.styles';

/**
 * Props accepted by the Checkbox component.
 */
export interface CheckboxProps {
  /**
   * Boolean indicating if the checkbox is checked or not.
   *
   * @default false
   */
  checked?: boolean;
  /**
   * Boolean indicating if the checkbox is disabed or not.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * Callback called when the checkbox "isChecked" value is changed.
   */
  onChange?: (checked: boolean) => void;
  /**
   * The background color of the checkbox when it is checked.
   *
   * @default 'primary-base'
   */
  primaryColor?: ColorProp;
  /**
   * The color of the checked icon when the checkbox is checked.
   *
   * @default 'text-primary'
   */
  secondaryColor?: ColorProp;
  /**
   * The color of the checkbox when it is not checked (background and border).
   *
   * @default 'background-light'
   */
  tertiaryColor?: ColorProp;
}

export function useCheckboxStyles(
  props: Required<
    Pick<
      CheckboxProps,
      'checked' | 'disabled' | 'primaryColor' | 'secondaryColor' | 'tertiaryColor'
    >
  >,
) {
  const { utils } = useMonkTheme();

  const colors = useMemo(() => {
    const primary = utils.getColor(props.primaryColor);
    const secondary = utils.getColor(props.secondaryColor);
    const tertiary = utils.getColor(props.tertiaryColor);
    return {
      primary,
      secondary,
      tertiary,
      tertiaryBg: changeAlpha(tertiary, 0.5),
    };
  }, [props.primaryColor, props.secondaryColor, props.tertiaryColor]);

  return {
    checkboxStyles: {
      ...styles['checkbox'],
      ...(props.disabled ? styles['checkboxDisabled'] : {}),
      backgroundColor: props.checked ? colors.primary : colors.tertiaryBg,
      borderColor: props.checked ? colors.primary : colors.tertiary,
    } as CSSProperties,
    icon: {
      primaryColor: colors.secondary,
    },
  };
}
