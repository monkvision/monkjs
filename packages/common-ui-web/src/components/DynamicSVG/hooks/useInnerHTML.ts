import { useMemo } from 'react';
import { DynamicSVGCustomizationFunctions, SVGElementCustomProps } from './types';

/**
 * Custom hook used to generate the inner HTML of an SVG element encapsulated by an SVGElement component. This hook
 * will properly handle special cases (such as `<style>` tags with inner text etc.), and will use the `getInnerText`
 * customization function to generate the element's inner HTML for general cases.
 */
export function useInnerHTML({
  element,
  groups,
  getInnerText,
}: Pick<DynamicSVGCustomizationFunctions, 'getInnerText'> & Required<SVGElementCustomProps>) {
  return useMemo(() => {
    if (element.tagName === 'style') {
      return element.innerHTML;
    }
    return getInnerText ? getInnerText(element, groups) : null;
  }, [element, groups, getInnerText]);
}
