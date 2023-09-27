import { SVGProps, useMemo } from 'react';
import { DynamicSVGCustomizationFunctions, SVGElementCustomProps } from './propTypes';

/**
 * Custom hook used to create the custom attributes given to an SVG element encapsulated in an SVGElement component.
 * This hook returns the custom attributes generated using the `getAttributes` customization function, but also adds
 * custom attributes used to make the SVG work properly (removing pointer events on the SVG element etc...).
 */
export function useCustomAttributes({
  element,
  groupIds,
  getAttributes,
}: Pick<DynamicSVGCustomizationFunctions, 'getAttributes'> &
  Required<SVGElementCustomProps>): SVGProps<SVGSVGElement> | null {
  return useMemo(() => {
    const elementTag = element.tagName;

    if (['svg', 'g'].includes(elementTag)) {
      return { pointerEvents: 'box-none' };
    }

    return getAttributes ? getAttributes(element, groupIds) : null;
  }, [element, groupIds, getAttributes]);
}
