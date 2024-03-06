import { useRef } from 'react';
import { useInteractiveStatus } from '@monkvision/common';
import { SliderProps, useSliderStyle, useSlider } from './hooks';

/**
 * A Slider component that allows users to select a value within a specified range by dragging along a horizontal track.
 */
export function Slider({
  min = 0,
  max = 100,
  value = (max - min) / 2,
  primaryColor = 'primary',
  secondaryColor = 'primary',
  tertiaryColor = 'secondary-xlight',
  disabled = false,
  step = 1,
  onChange,
  style,
}: SliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const { thumbPosition, handleStart, isDragging } = useSlider({
    sliderRef,
    value,
    min,
    max,
    step: step > 0 ? step : 1,
    disabled,
    onChange,
  });
  const { status, eventHandlers } = useInteractiveStatus({
    disabled,
  });
  const { sliderStyle, thumbStyle, progressBarStyle, trackBarStyle, hoverThumbStyle } =
    useSliderStyle({
      primaryColor,
      secondaryColor,
      tertiaryColor,
      style,
      status,
    });

  return (
    <div
      role='button'
      tabIndex={0}
      ref={sliderRef}
      style={sliderStyle}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
      data-testid='slider'
    >
      <div style={{ ...trackBarStyle }} data-testid='track' />
      <div style={{ ...progressBarStyle, width: `${thumbPosition}%` }} data-testid='value-track' />
      <div style={{ ...hoverThumbStyle, left: `${thumbPosition}%` }} data-testid='hover-thumb' />
      <div
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          ...thumbStyle,
          left: `${thumbPosition}%`,
        }}
        onMouseEnter={eventHandlers.onMouseEnter}
        onMouseLeave={eventHandlers.onMouseLeave}
        data-testid='thumb'
      />
    </div>
  );
}
