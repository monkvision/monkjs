import { ColorProp, InteractiveStatus } from '@monkvision/types';
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
  /**
   * The color of the label.
   *
   * @default 'text-primary'
   */
  labelColor?: ColorProp;
  /**
   * The label of the checkbox.
   */
  label?: string;
}

export function useCheckboxStyles(
  props: Required<
    Pick<
      CheckboxProps,
      'checked' | 'primaryColor' | 'secondaryColor' | 'tertiaryColor' | 'labelColor'
    >
  > & { status: InteractiveStatus },
) {
  const { utils } = useMonkTheme();

  const colors = useMemo(() => {
    const primary = utils.getColor(props.primaryColor);
    const secondary = utils.getColor(props.secondaryColor);
    const tertiary = utils.getColor(props.tertiaryColor);
    const label = utils.getColor(props.labelColor);
    return {
      primary,
      primary5: changeAlpha(primary, 0.05),
      primary18: changeAlpha(primary, 0.18),
      secondary,
      tertiary,
      tertiary5: changeAlpha(tertiary, 0.05),
      tertiary18: changeAlpha(tertiary, 0.18),
      tertiary50: changeAlpha(tertiary, 0.5),
      label,
    };
  }, [props.primaryColor, props.secondaryColor, props.tertiaryColor]);

  let interactiveOverlayBackgroundColor = 'transparent';
  if (props.status === InteractiveStatus.HOVERED) {
    interactiveOverlayBackgroundColor = props.checked ? colors.primary5 : colors.tertiary5;
  } else if (props.status === InteractiveStatus.ACTIVE) {
    interactiveOverlayBackgroundColor = props.checked ? colors.primary18 : colors.tertiary18;
  }

  return {
    checkboxStyles: {
      ...styles['checkbox'],
      ...(props.status === InteractiveStatus.DISABLED ? styles['checkboxDisabled'] : {}),
      backgroundColor: props.checked ? colors.primary : colors.tertiary50,
      borderColor: props.checked ? colors.primary : colors.tertiary,
    } as CSSProperties,
    icon: {
      primaryColor: colors.secondary,
    },
    interactiveOverlayStyle: {
      ...styles['interactiveOverlay'],
      backgroundColor: interactiveOverlayBackgroundColor,
    },
    labelStyle: {
      ...styles['label'],
      color: colors.label,
    },
  };
}
