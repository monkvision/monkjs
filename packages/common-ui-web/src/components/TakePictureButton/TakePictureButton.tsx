import './TakePictureButton.css';

import React, { forwardRef, useCallback } from 'react';

import { TakePictureButtonProps, useTakePictureButtonStyle } from './hooks';

/**
 * A custom button that is used as a take-picture button in camera HUDs throughout the MonkJs SDK.
 */
export const TakePictureButton = forwardRef<HTMLButtonElement, TakePictureButtonProps>(
  ({ size = 60, disabled = false, style, ...passThroughProps }, ref) => {
    const { innerLayer, outerLayer } = useTakePictureButtonStyle({ size });

    const withDisableSuffix = useCallback(
      (className: string) => `${className}${disabled ? ' disabled' : ''}`,
      [disabled],
    );

    return (
      <div
        className={withDisableSuffix('take-picture-btn')}
        data-testid='take-picture-btn-outer-layer'
        style={{ ...outerLayer }}
      >
        <button
          ref={ref}
          data-testid='take-picture-btn'
          disabled={disabled}
          style={{ ...innerLayer, ...style }}
          {...passThroughProps}
        ></button>
      </div>
    );
  },
);
