import React, { forwardRef } from 'react';
import { SpinnerProps, useSpinnerStyle } from './hooks';
import './Spinner.css';

/**
 * Spinner component that can be used to display a loading spinner.
 */
export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size, primaryColor, className = '', style = {}, ...passThroughProps }, ref) => {
    const { spinner, container, layer1, layer2 } = useSpinnerStyle({
      size,
      primaryColor,
    });
    return (
      <div
        ref={ref}
        data-testid='monk-spinner'
        className={`mnk-spinner ${className}`}
        style={{ ...spinner, ...style }}
        {...passThroughProps}
      >
        <div className='mnk-spinner-container' style={container}>
          <span className='mnk-spinner-layer-1' style={layer1}>
            <span
              data-testid='mnk-spinner-colored-layer'
              className='mnk-spinner-layer-2'
              style={layer2}
            ></span>
          </span>
        </div>
      </div>
    );
  },
);
