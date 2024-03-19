import {
  getInteractiveVariants,
  InteractiveVariation,
  LoadingState,
  useMonkTheme,
} from '@monkvision/common';
import {
  Color,
  ColorProp,
  InteractiveStatus,
  RequiredProperties,
  ResponsiveStyleProperties,
} from '@monkvision/types';
import { useMemo } from 'react';
import { IconName } from '../../icons';
import {
  BUTTON_CONTENT_SIZE_NORMAL,
  BUTTON_CONTENT_SIZE_SMALL,
  buttonTextBackgrounds,
  styles,
} from './Button.styles';

/**
 * Variant of the button.
 */
export type ButtonVariant = 'fill' | 'outline' | 'text' | 'text-link';

/**
 * Size of the button.
 */
export type ButtonSize = 'normal' | 'small';

/**
 * Shade of the button.
 */
export type ButtonShade = 'dark' | 'light';

/**
 * Additional props that can be passed to the Button component.
 */
export interface MonkButtonProps {
  /**
   * The variant of the button.
   *
   * @default 'fill'
   */
  variant?: ButtonVariant;
  /**
   * The size of the button.
   *
   * @default 'normal'
   */
  size?: ButtonSize;
  /**
   * The primary color of the button. For filled buttons, it corresponds to the background color, for other buttons, it
   * corresponds to the text color.
   *
   * @default 'primary-xlight' for outline buttons and 'primary' for other buttons
   */
  primaryColor?: ColorProp;
  /**
   * The secondary color of the button. For filled buttons, it corresponds to the text color and for outline buttons, it
   * corresponds to the background color. This property is ignored for text and text-link buttons.
   *
   * @default 'text-white' for filled buttons and 'surface-s1' for outline buttons.
   */
  secondaryColor?: ColorProp;
  /**
   * The icon to place on the left of the button text. No icon will be placed if not provided.
   */
  icon?: IconName;
  /**
   * This prop specifies if the Button is loading. A loading button is automatically disabled and its content is
   * replaced by a spinner. This prop can either be a simple boolean indicating if the button is loading or not, or a
   * `LoadingState` object created using the `useLoadingState` hook.
   *
   * @see useLoadingState
   */
  loading?: boolean | LoadingState;
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
  /**
   * Value indicating if the button is a light color button or a dark color button (used for interactive colors).
   *
   * @default: 'dark'
   */
  shade?: ButtonShade;
}

interface MonkButtonChildStyle {
  style: ResponsiveStyleProperties;
  color: Color;
  size: number;
}

interface MonkButtonStyle {
  style: ResponsiveStyleProperties;
  iconStyle: MonkButtonChildStyle;
  spinnerStyle: MonkButtonChildStyle;
}

interface MonkButtonStyleParams
  extends RequiredProperties<
    MonkButtonProps,
    'variant' | 'size' | 'primaryColor' | 'secondaryColor' | 'shade'
  > {
  status: InteractiveStatus;
  hasChildren: boolean;
}

function getInteractiveVariation(shade: ButtonShade): InteractiveVariation {
  return shade === 'dark' ? InteractiveVariation.LIGHTEN : InteractiveVariation.DARKEN;
}

export function useButtonStyle(params: MonkButtonStyleParams): MonkButtonStyle {
  const { utils } = useMonkTheme();
  const { primary, secondary } = useMemo(
    () => ({
      primary: getInteractiveVariants(
        utils.getColor(params.primaryColor),
        getInteractiveVariation(params.shade),
      ),
      secondary: getInteractiveVariants(
        utils.getColor(params.secondaryColor),
        getInteractiveVariation(params.shade),
      ),
    }),
    [params, utils],
  );

  return useMemo(() => {
    let foregroundColor = primary[InteractiveStatus.DEFAULT];
    if (params.variant === 'fill') {
      foregroundColor = secondary[InteractiveStatus.DEFAULT];
    } else if (params.variant === 'text-link') {
      foregroundColor = primary[params.status];
    }

    let backgroundColor = 'transparent';
    if (params.variant === 'fill') {
      backgroundColor = primary[params.status];
    } else if (params.variant === 'outline') {
      backgroundColor = secondary[params.status];
    } else if (params.variant === 'text') {
      backgroundColor = buttonTextBackgrounds[params.status];
    }
    const contentSize =
      params.size === 'normal' ? BUTTON_CONTENT_SIZE_NORMAL : BUTTON_CONTENT_SIZE_SMALL;

    return {
      style: {
        ...styles['button'],
        ...(params.status === InteractiveStatus.DISABLED ? styles['buttonDisabled'] : {}),
        ...(params.size === 'small' ? styles['buttonSmall'] : {}),
        ...(params.variant === 'outline' ? styles['buttonOutline'] : {}),
        ...(params.variant === 'text-link' ? styles['buttonTextLink'] : {}),
        color: foregroundColor,
        borderColor: foregroundColor,
        backgroundColor,
      },
      iconStyle: {
        style: {
          ...styles['icon'],
          ...(params.size === 'small' ? styles['iconSmall'] : {}),
          ...(!params.hasChildren ? styles['iconOnly'] : {}),
        },
        color: foregroundColor,
        size: contentSize,
      },
      spinnerStyle: {
        style: {
          top: `calc(50% - ${contentSize / 2}px)`,
          left: `calc(50% - ${contentSize / 2}px)`,
          ...(params.preserveWidthOnLoading ? styles['spinnerFixedWith'] : {}),
        },
        color: foregroundColor,
        size: contentSize,
      },
    };
  }, [params, primary, secondary]);
}
