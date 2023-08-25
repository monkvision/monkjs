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
        className={`monk-spinner ${className}`}
        style={{ ...spinner, ...style }}
        {...passThroughProps}
      >
        <div className='monk-spinner-container' style={container}>
          <span className='monk-spinner-layer-1' style={layer1}>
            <span className='monk-spinner-layer-2' style={layer2}></span>
          </span>
        </div>
      </div>
    );
  },
);
