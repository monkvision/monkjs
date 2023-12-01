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
    const { innerLayer, outerLayer } = useTakePictureButtonStyle({ size, status });

    return (
      <div style={{ ...outerLayer, ...style }} data-testid='take-picture-btn-outer-layer'>
        <button
          ref={ref}
          style={{ ...innerLayer }}
          disabled={disabled}
          {...eventHandlers}
          {...passThroughProps}
          data-testid='take-picture-btn'
        ></button>
      </div>
    );
  },
);
