import { CSSProperties, SVGProps, useMemo } from 'react';
import { DynamicSVGCustomizationFunctions, SVGElementCustomProps } from './types';

/**
 * Custom hook used to create the custom attributes given to an SVG element encapsulated in an SVGElement component.
 * This hook returns the custom attributes generated using the `getAttributes` customization function, but also adds
 * custom attributes used to make the SVG work properly (removing pointer events on the SVG element etc...).
 */
export function useCustomAttributes({
  element,
  groups,
  getAttributes,
  style,
}: Pick<DynamicSVGCustomizationFunctions, 'getAttributes'> &
  Required<SVGElementCustomProps> & { style: CSSProperties }): SVGProps<SVGElement> | null {
  return useMemo(() => {
    const elementTag = element.tagName;
    if (elementTag === 'svg') {
      return { pointerEvents: 'box-none' };
    }
    if (!getAttributes) {
      return { style };
    }
    const attributes = getAttributes(element, groups);
    if (elementTag === 'g') {
      attributes.pointerEvents = 'box-none';
    }
    return { ...attributes, style: { ...attributes?.style, ...style } };
  }, [element, groups, getAttributes]);
}
