import React, { useState, useEffect } from 'react';

/**
 * Computes the initial position of the slider thumb based on the given value within the specified range.
 * @param min - The minimum value of the range.
 * @param max - The maximum value of the range.
 * @param value - The current value of the slider.
 * @returns A number representing the initial position of the slider thumb, scaled between 0 and 100.
 */
function computeFirstThumbPosition(min: number, max: number, value: number) {
  if (value > max) {
    return 100;
  }
  if (value < min) {
    return 0;
  }
  return ((value - min) / (max - min)) * 100;
}

/**
 * Computes the position of the slider thumb based on the user input event, slider dimensions, and configuration parameters.
 * @param event - The mouse event or touch event triggering the position computation.
 * @param sliderRef - Reference to the HTMLDivElement representing the slider.
 * @param step - The step value for the slider.
 * @param min - The minimum value of the slider range.
 * @param max - The maximum value of the slider range.
 * @returns The computed position of the slider thumb as a percentage.
 */
function computeThumbPosition(
  event: MouseEvent | TouchEvent,
  sliderRef: React.RefObject<HTMLDivElement>,
  step: number,
  min: number,
  max: number,
): number {
  if (!sliderRef.current) {
    return 0;
  }

  const sliderElement = sliderRef.current;
  const sliderRect = sliderElement.getBoundingClientRect();

  // Compute the x-coordinate relative to the slider element
  const offsetX = Math.max(
    0,
    Math.min(
      sliderRect.width,
      (event instanceof MouseEvent ? event.clientX : event.touches[0].clientX) - sliderRect.left,
    ),
  );

  const positionPercentage = (offsetX / sliderRect.width) * 100;

  // Calculate the step incrementation based on the slider range and step value
  const stepPercentage = 100 / ((max - min) / step);
  // Round the position percentage to the nearest step incrementation
  return Math.round(positionPercentage / stepPercentage) * stepPercentage;
}

/**
 * Computes the new value based on the rounded percentage position of the slider thumb, the slider's range, and step value.
 * @param roundedPercentage - The rounded percentage position of the slider thumb.
 * @param max - The maximum value of the slider range.
 * @param min - The minimum value of the slider range.
 * @param step - The step value for the slider.
 * @returns The new value computed based on the slider's configuration.
 */
function computeNewValue(roundedPercentage: number, max: number, min: number, step: number) {
  let multiplier = 1;
  if (!Number.isInteger(step)) {
    const nbDigitAfterDot = step.toString().split('.')[1].length;
    multiplier = 10 ** nbDigitAfterDot;
  }
  return Math.round(((max - min) * (roundedPercentage / 100) + min) * multiplier) / multiplier;
}

/**
 * Props accepted by the userSlider hook.
 */
export interface useSliderProps {
  /** Reference to the HTMLDivElement representing the slider. */
  sliderRef: React.RefObject<HTMLDivElement>;

  /** The current value of the slider. */
  value: number;

  /** The minimum value of the slider range. */
  min: number;

  /** The maximum value of the slider range. */
  max: number;

  /** The step value for the slider. */
  step: number;

  /** Indicates whether the slider is disabled or not. */
  disabled: boolean;

  /**
   * Callback function invoked when the slider value changes.
   * @param value - The new value of the slider.
   */
  onChange?: (value: number) => void;
}

/**
 * Custom hook for creating a slider component with customizable behavior.
 * @param options - The configuration options for the slider component.
 * @returns An object containing the current thumb position, a handler to start dragging the thumb, and a boolean indicating if the thumb is currently being dragged.
 */
export function useSlider({
  sliderRef,
  value,
  min,
  max,
  step,
  disabled,
  onChange,
}: useSliderProps) {
  const [thumbPosition, setThumbPosition] = useState(computeFirstThumbPosition(min, max, value));
  const [isDragging, setIsDragging] = useState(false);

  const handleStart = () => {
    setIsDragging(true);
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  const handleMove = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    if (isDragging && !disabled && max > min && onChange) {
      const roundedPercentage = computeThumbPosition(event, sliderRef, step, min, max);
      setThumbPosition(roundedPercentage);

      const newValue = computeNewValue(roundedPercentage, max, min, step);
      onChange(newValue);
    }
  };

  const handleClick = (event: MouseEvent) => {
    event.preventDefault();
    if (!disabled && max > min && onChange) {
      const roundedPercentage = computeThumbPosition(event, sliderRef, step, min, max);
      setThumbPosition(roundedPercentage);

      const newValue = computeNewValue(roundedPercentage, max, min, step);
      onChange(newValue);
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchend', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: false });
    sliderRef?.current?.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('touchend', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      sliderRef?.current?.removeEventListener('click', handleClick);
    };
  }, [isDragging]);

  return { thumbPosition, handleStart, isDragging };
}
