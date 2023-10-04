import { Sight } from '@monkvision/types';
import { forwardRef } from 'react';
import { DynamicSVG, DynamicSVGProps } from '../DynamicSVG';

/**
 * Props accepted by the SightOverlay component.
 */
export interface SightOverlayProps extends Omit<DynamicSVGProps, 'svg'> {
  /**
   * The sight to display the overlay of.
   */
  sight: Sight;
}

/**
 * A component that takes a Sight and displays its SVG overlay. You can customize the style and display properties of
 * the SVG element the same way you can customize the DynamicSVG component.
 *
 * @see DynamicSVG
 */
export const SightOverlay = forwardRef<SVGSVGElement, SightOverlayProps>(
  ({ sight, ...passThroughProps }, ref) => {
    return <DynamicSVG ref={ref} svg={sight.overlay} {...passThroughProps} />;
  },
);
