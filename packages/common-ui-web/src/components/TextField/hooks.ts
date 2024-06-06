import { ColorProp, RequiredProperties } from '@monkvision/types';
import { changeAlpha, useMonkTheme } from '@monkvision/common';
import { CSSProperties, useMemo } from 'react';
import { IconName } from '../../icons';
import { styles } from './TextField.styles';

/**
 * Props accepted by the TextField component.
 */
export interface TextFieldProps {
  /**
   * The type of the underlying HTMLInput element.
   *
   * @default 'text'
   */
  type?: 'email' | 'password' | 'tel' | 'text';
  /**
   * The value of the text field.
   */
  value?: string;
  /**
   * Callback called when the value of the text field changes.
   */
  onChange?: (newValue: string) => void;
  /**
   * Boolean indicating if the text field is disabled or not.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * Boolean indicating if the input should be highlighted (ex: in case of errors).
   *
   * @default false
   */
  highlighted?: boolean;
  /**
   * Boolean indicating if the font family of the input should be monospace.
   *
   * @default false
   */
  monospace?: boolean;
  /**
   * The label of the text field.
   */
  label?: string;
  /**
   * The placeholder of the input.
   */
  placeholder?: string;
  /**
   * The unit symbol of the text field.
   */
  unit?: string;
  /**
   * The position of the unit symbol.
   *
   * @default 'left'
   */
  unitPosition?: 'left' | 'right';
  /**
   * The name of the icon on the left of the text field.
   */
  icon?: IconName;
  /**
   * Boolean indicating if the button allowing the user to clear the field should be displayed or not.
   *
   * @default true
   */
  showClearButton?: boolean;
  /**
   * Assistive text label under the text field.
   */
  assistiveText?: string;
  /**
   * Fixed width for the text field. If not set, the text field expands to the max width of its container.
   */
  fixedWidth?: number;
  /**
   * The accent color of the text field when focused.
   *
   * @default 'primary-base'
   */
  focusColor?: ColorProp;
  /**
   * The accent color of the text field when not focused.
   *
   * @default 'text-primary'
   */
  neutralColor?: ColorProp;
  /**
   * The background color of the text field.
   *
   * @default 'background-light'
   */
  backgroundColor?: ColorProp;
}

export type TextFieldStylesParams = RequiredProperties<
  TextFieldProps,
  | 'disabled'
  | 'highlighted'
  | 'monospace'
  | 'unitPosition'
  | 'showClearButton'
  | 'focusColor'
  | 'neutralColor'
  | 'backgroundColor'
> & { isFocused: boolean; isFilled: boolean };

export function useTextFieldStyles(props: TextFieldStylesParams) {
  const { utils } = useMonkTheme();

  const colors = useMemo(() => {
    const focus = utils.getColor(props.focusColor);
    const neutral = utils.getColor(props.neutralColor);
    const backgroundColor = utils.getColor(props.backgroundColor);

    return {
      focus,
      neutral,
      neutral30: changeAlpha(neutral, 0.3),
      backgroundColor,
    };
  }, [props.focusColor, props.neutralColor, props.backgroundColor]);

  let borderColor = colors.neutral30;
  if (props.isFilled) {
    borderColor = colors.neutral;
  }
  if (props.isFocused || props.highlighted) {
    borderColor = colors.focus;
  }

  return {
    mainContainerStyle: {
      ...styles['mainContainer'],
      ...(props.disabled ? styles['mainContainerDisabled'] : {}),
      width: props.fixedWidth ?? '100%',
    },
    componentsContainerStyle: {
      ...styles['componentsContainer'],
      paddingLeft: props.icon ? 12 : 16,
      paddingRight: props.showClearButton ? 12 : 16,
      borderWidth: props.highlighted ? 1 : 0,
      borderBottomWidth: props.isFocused ? 2 : 1,
      borderColor,
      marginBottom: props.isFocused ? 0 : 1,
      backgroundColor: colors.backgroundColor,
      cursor: props.disabled ? 'default' : 'text',
    },
    leftIcon: {
      size: 24,
      primaryColor: colors.neutral,
      style: styles['icon'],
    },
    inputContainerStyle: {
      ...styles['inputContainer'],
      flexDirection: props.unitPosition === 'left' ? 'row' : 'row-reverse',
    } as CSSProperties,
    unitStyle: {
      ...styles['unit'],
      color: colors.neutral,
      paddingLeft: props.unitPosition === 'left' ? 0 : 6,
      paddingRight: props.unitPosition === 'left' ? 6 : 0,
    },
    labelStyle: {
      ...styles['label'],
      ...(props.isFilled || props.isFocused ? styles['labelFloating'] : {}),
      color: props.isFocused || props.highlighted ? colors.focus : colors.neutral,
    },
    inputStyle: {
      ...styles['input'],
      color: colors.neutral,
      fontFamily: props.monospace ? 'monospace' : 'sans-serif',
    },
    clearButton: {
      primaryColor: colors.neutral,
      style: styles['clearButton'],
      visibility: props.isFilled ? 'visible' : 'hidden',
    },
    assistiveTextStyle: {
      ...styles['assistiveText'],
      color: props.isFocused || props.highlighted ? colors.focus : colors.neutral,
    },
  };
}
