import { useMonkTheme } from '@monkvision/common';
import { ColorProp } from '@monkvision/types';
import React, { SVGProps } from 'react';
import { DynamicSVG } from '../DynamicSVG';

/**
 * Props that can be passed to the spinner component.
 */
export interface SpinnerProps extends SVGProps<SVGSVGElement> {
  /**
   * The size of the spinner (width and height, in pixels). The width of the spinner line is scaled accordingly.
   *
   * @default 50
   */
  size?: number;
  /**
   * The name or hexcode of the spinner's color.
   *
   * @default text-white
   */
  primaryColor?: ColorProp;
}

const animatedSpinnerSvg =
  '<svg stroke="#000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>@keyframes spinner_zKoa{to{transform:rotate(360deg)}}@keyframes spinner_YpZS{0%{stroke-dasharray:0 150;stroke-dashoffset:0}47.5%{stroke-dasharray:42 150;stroke-dashoffset:-16}95%,to{stroke-dasharray:42 150;stroke-dashoffset:-59}}</style><g style="transform-origin:center;animation:spinner_zKoa 2s linear infinite"><circle cx="12" cy="12" r="9.5" fill="none" stroke-width="3" style="stroke-linecap:round;animation:spinner_YpZS 1.5s ease-in-out infinite"/></g></svg>';

/**
 * Spinner component that can be used to display a loading spinner.
 */
export function Spinner({
  size = 50,
  primaryColor = 'text-white',
  ...passThroughProps
}: SpinnerProps) {
  const { utils } = useMonkTheme();
  const stroke = utils.getColor(primaryColor);

  return (
    <DynamicSVG
      style={{ width: size, height: size }}
      width={size}
      height={size}
      svg={animatedSpinnerSvg}
      getAttributes={() => ({ stroke })}
      {...passThroughProps}
    />
  );
}
