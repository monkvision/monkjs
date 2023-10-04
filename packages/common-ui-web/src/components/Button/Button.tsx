import {
  ButtonHTMLAttributes,
  forwardRef,
  MouseEvent,
  PropsWithChildren,
  useCallback,
  useMemo,
} from 'react';
import { Icon } from '../../icons';
import { Spinner } from '../Spinner';
import './Button.css';
import { MonkButtonProps, useButtonStyle } from './hooks';

/**
 * Props that the Button component can accept.
 */
export type ButtonProps = Partial<MonkButtonProps> & ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Basic button component, available with 4 variants. Accepts optional MonkButtonProps (see the `MonkButtonProps`
 * interface for more details), as well as HTMLButtonElement props that are passed through the underlying button
 * element. The ref is also forwarded to the button.
 *
 * @see MonkButtonProps
 */
export const Button = forwardRef<HTMLButtonElement, PropsWithChildren<ButtonProps>>(
  (
    {
      primaryColor,
      secondaryColor,
      variant,
      size,
      icon,
      loading,
      preserveWidthOnLoading = false,
      style = {},
      className = '',
      disabled,
      onMouseDown,
      children,
      ...passThroughProps
    },
    ref,
  ) => {
    const isDisabled = useMemo(() => !!disabled || !!loading, [disabled, loading]);
    const {
      style: buttonStyle,
      className: buttonClassName,
      spinner,
      icon: iconStyle,
    } = useButtonStyle({
      primaryColor,
      secondaryColor,
      variant,
      size,
      loading,
      preserveWidthOnLoading,
      isDisabled,
      hasChildren: !!children,
    });
    const handleMouseDown = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (onMouseDown) {
          onMouseDown(event);
        }
      },
      [onMouseDown],
    );
    const content = useMemo(
      () => (
        <>
          {icon && (
            <Icon
              className={iconStyle.className}
              icon={icon}
              size={iconStyle.size}
              primaryColor={iconStyle.color}
            />
          )}
          {children}
        </>
      ),
      [icon, iconStyle, children],
    );
    const loadingContent = useMemo(
      () =>
        preserveWidthOnLoading ? (
          <div className='mnk-button-fixed-loading-container'>
            <div className='mnk-button-loading-hidden-content'>{content}</div>
            <Spinner
              className='button-spinner'
              style={spinner.style}
              size={spinner.size}
              primaryColor={spinner.color}
            />
          </div>
        ) : (
          <Spinner
            className='mnk-button-spinner'
            style={spinner.style}
            size={spinner.size}
            primaryColor={spinner.color}
          />
        ),
      [preserveWidthOnLoading, content, spinner],
    );

    return (
      <button
        ref={ref}
        style={{ ...buttonStyle, ...style }}
        className={`${buttonClassName} ${className}`}
        disabled={disabled || loading}
        onMouseDown={handleMouseDown}
        data-testid='monk-btn'
        {...passThroughProps}
      >
        {loading ? loadingContent : content}
      </button>
    );
  },
);
