import { useInteractiveStatus } from '@monkvision/common';
import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { MonkTakePictureButtonProps, useTakePictureButtonStyle } from './hooks';

/**
 * Props that the TakePictureButton component can accept.
 */
export type TakePictureButtonProps = MonkTakePictureButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * A custom button that is used as a take-picture button in camera HUDs throughout the MonkJs SDK.
 */
export const TakePictureButton = forwardRef<HTMLButtonElement, TakePictureButtonProps>(
  (
    {
      size = 60,
      disabled = false,
      style = {},
      onClick,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      ...passThroughProps
    },
    ref,
  ) => {
    const { status, eventHandlers } = useInteractiveStatus({
      disabled,
      componentHandlers: {
        onMouseEnter,
        onMouseLeave,
        onMouseDown,
        onMouseUp,
      },
    });
    const {
      buttonStyles: { innerLayer, outerLayer },
      animateClick,
    } = useTakePictureButtonStyle({ size, status });
    const onButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      animateClick();
      if (onClick) {
        onClick(event);
      }
    };

    return (
      <div style={{ ...outerLayer, ...style }} data-testid='take-picture-btn-outer-layer'>
        <button
          ref={ref}
          style={{ ...innerLayer }}
          disabled={disabled}
          onClick={onButtonClick}
          {...eventHandlers}
          {...passThroughProps}
          data-testid='take-picture-btn'
        ></button>
      </div>
    );
  },
);
