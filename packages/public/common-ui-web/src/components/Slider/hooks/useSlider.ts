import { useState, RefObject, useLayoutEffect } from 'react';

function getFirstThumbPosition(min: number, max: number, value: number): number {
  if (value > max) {
    return 100;
  }
  if (value < min) {
    return 0;
  }
  return ((value - min) / (max - min)) * 100;
}

function getThumbPosition(
  event: MouseEvent | TouchEvent,
  sliderRef: RefObject<HTMLDivElement>,
  step: number,
  min: number,
  max: number,
): number {
  if (!sliderRef.current) {
    return 0;
  }
  const sliderElement = sliderRef.current;
  const sliderRect = sliderElement.getBoundingClientRect();
  const offsetX = Math.max(
    0,
    Math.min(
      sliderRect.width,
      (event instanceof MouseEvent ? event.clientX : event.touches[0].clientX) - sliderRect.left,
    ),
  );
  const positionPercentage = (offsetX / sliderRect.width) * 100;
  const stepPercentage = 100 / ((max - min) / step);
  return Math.round(positionPercentage / stepPercentage) * stepPercentage;
}

function getNewSliderValue(
  roundedPercentage: number,
  max: number,
  min: number,
  step: number,
): number {
  let multiplier = 1;
  if (!Number.isInteger(step)) {
    const nbDigitAfterDot = step.toString().split('.')[1].length;
    multiplier = 10 ** nbDigitAfterDot;
  }
  return Math.round(((max - min) * (roundedPercentage / 100) + min) * multiplier) / multiplier;
}

export interface UseSliderParams {
  sliderRef: RefObject<HTMLDivElement>;
  value: number;
  min: number;
  max: number;
  step: number;
  disabled: boolean;
  onChange?: (value: number) => void;
}

export function useSlider({
  sliderRef,
  value,
  min,
  max,
  step,
  disabled,
  onChange,
}: UseSliderParams) {
  const [thumbPosition, setThumbPosition] = useState(getFirstThumbPosition(min, max, value));
  const [isDragging, setIsDragging] = useState(false);

  const handleStart = () => {
    setIsDragging(true);
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  const handleMove = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    if (!disabled && max > min && onChange) {
      const roundedPercentage = getThumbPosition(event, sliderRef, step, min, max);
      setThumbPosition(roundedPercentage);

      const newValue = getNewSliderValue(roundedPercentage, max, min, step);
      onChange(newValue);
    }
  };

  useLayoutEffect(() => {
    if (!isDragging) {
      return () => {};
    }
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove, { passive: false });

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('touchmove', handleMove);
    };
  }, [isDragging]);

  useLayoutEffect(() => {
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);
    sliderRef?.current?.addEventListener('click', handleMove);

    return () => {
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchend', handleEnd);
      sliderRef?.current?.removeEventListener('click', handleMove);
    };
  }, []);

  return { thumbPosition, handleStart, isDragging };
}
