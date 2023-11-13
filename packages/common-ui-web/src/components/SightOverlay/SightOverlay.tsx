import { Sight } from '@monkvision/types';
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
export function SightOverlay({ sight, ...passThroughProps }: SightOverlayProps) {
  return <DynamicSVG svg={sight.overlay} {...passThroughProps} />;
}
