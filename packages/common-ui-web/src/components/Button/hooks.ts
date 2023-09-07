import { useMonkTheme } from '@monkvision/common';
import { Color, ColorProp, RequiredProperties } from '@monkvision/types';
import { CSSProperties, useMemo } from 'react';
import { IconName } from '../../icons';

/**
 * Variant of the button.
 */
export type ButtonVariant = 'fill' | 'outline' | 'text' | 'text-link';

/**
 * Size of the button.
 */
export type ButtonSize = 'normal' | 'small';

/**
 * Additional props that can be passed to the Button component.
 */
export interface MonkButtonProps {
  /**
   * The variant of the button.
   *
   * @default fill
   */
  variant?: ButtonVariant;
  /**
   * The size of the button.
   *
   * @default normal
   */
  size?: ButtonSize;
  /**
   * The primary color of the button. For filled buttons, it corresponds to the background color, for other buttons, it
   * corresponds to the text color.
   *
   * @default primary-xlight for outline buttons and primary for other buttons
   */
  primaryColor?: ColorProp;
  /**
   * The secondary color of the button. For filled buttons, it corresponds to the text color and for outline buttons, it
   * corresponds to the background color. This property is ignored for text and text-link buttons.
   *
   * @default text-white for filled buttons and surface-s1 for outline buttons.
   */
  secondaryColor?: ColorProp;
  /**
   * The icon to place on the left of the button text. No icon will be placed if not provided.
   */
  icon?: IconName;
  /**
   * Boolean indicating if the button is loading. When the button is loading, it is automatically disabled and its
   * content is replaced by a spinner.
   */
  loading?: boolean;
  /**
   * Boolean indicating if the button should keep its original width when loading. Set this property to `true` if you
   * want a button with a `width: fit-content` that keeps its content width when the content is replaced by a spinner.
   * This property has no effect for buttons with a set width.
   *
   * **Important note : In order for this to work, its original content must be properly defined. The button can't
   * calculate its original width without being passed its content first!**
   *
   * @default false
   */
  preserveWidthOnLoading?: boolean;
}

interface ButtonIconStyle {
  color: Color;
  size: number;
  className: string;
}

interface ButtonSpinnerStyle {
  color: Color;
  size: number;
  style: CSSProperties;
}

interface ButtonStyle {
  className: string;
  style: CSSProperties;
  icon: ButtonIconStyle;
  spinner: ButtonSpinnerStyle;
}

function getDefaultsIfNotProvided(
  props: MonkButtonProps,
): RequiredProperties<MonkButtonProps, 'variant' | 'size' | 'primaryColor' | 'secondaryColor'> {
  const variant = props.variant ?? 'fill';
  const size = props.size ?? 'normal';
  const primaryColor = props.primaryColor ?? (variant === 'outline' ? 'primary-xlight' : 'primary');
  const secondaryColor =
    props.secondaryColor ?? (variant === 'outline' ? 'surface-s1' : 'text-white');
  return { variant, size, primaryColor, secondaryColor };
}

export function useButtonStyle(
  props: MonkButtonProps & { isDisabled: boolean; hasChildren: boolean },
): ButtonStyle {
  const { utils, palette } = useMonkTheme();
  return useMemo(() => {
    const requiredProps = getDefaultsIfNotProvided(props);
    const primary = utils.getColor(requiredProps.primaryColor);
    const secondary = utils.getColor(requiredProps.secondaryColor);

    const color = requiredProps.variant === 'fill' ? secondary : primary;
    let backgroundColor = 'transparent';
    if (requiredProps.variant === 'fill') {
      backgroundColor = primary;
    } else if (requiredProps.variant === 'outline') {
      backgroundColor = secondary;
    }
    const contentSize = requiredProps.size === 'normal' ? 24 : 18;

    return {
      className: `monk-btn ${requiredProps.variant} ${requiredProps.size}${
        props.isDisabled ? ' disabled' : ''
      }${props.loading && !props.preserveWidthOnLoading ? ' loading' : ''}`,
      style: {
        color,
        backgroundColor,
        borderColor: requiredProps.variant === 'outline' ? primary : 'transparent',
        outlineColor: palette.outline.base,
      },
      icon: {
        color,
        size: contentSize,
        className: `monk-btn-icon ${requiredProps.variant} ${requiredProps.size} ${
          props.hasChildren ? '' : 'icon-only'
        }`,
      },
      spinner: {
        color,
        size: contentSize,
        style: {
          top: `calc(50% - ${contentSize / 2}px)`,
          left: `calc(50% - ${contentSize / 2}px)`,
        },
      },
    };
  }, [props, utils, palette]);
}
