import { SVGProps, useMemo } from 'react';
import { DynamicSVGCustomizationFunctions, useXMLParser } from './hooks';
import { SVGElement } from './SVGElement';

/**
 * Props that can be passed to the DynamicSVG component.
 */
export interface DynamicSVGProps
  extends DynamicSVGCustomizationFunctions,
    Omit<SVGProps<SVGSVGElement>, 'ref'> {
  /**
   * A string representing the SVG image to display. This string will be parsed using the `useXMLParser` hook.
   */
  svg: string;
}

/**
 * Custom component that is used to display an SVG image from an SVG string, and dynamically customize this SVG by
 * passing custom attributes or inner text to the SVG children elements. The only required property is the SVG string
 * itself. The rest of the props are passed to the SVG element itself.
 *
 * In order to customize the SVG dynamically, you can pass customization functions as props : getAttributes and
 * getInnerText that will return respectively custom attributes and custom inner text for the SVG element and its
 * children based on the given element and its parent groups.
 *
 * @example
 * import React, { useCallback } from 'react';
 * import { DynamicSVG } from '@monkvision/common-ui-web';
 *
 * const svg = '<svg height="100" width="100"><circle id="circle1" cx="20" cy="20" r="30"/><circle id="circle2" cx="80" cy="80" r="30"/></svg>';
 *
 * // Applies a red fill and an onClick handler on the element with ID "circle1"
 * function MyCustomSVG() {
 *   const getAttributes = useCallback((element: Element) => {
 *     if (element.getAttribute('id') === 'circle1') {
 *       return {
 *         style: { fill: 'red' },
 *         onClick: () => console.log('hello'),
 *         pointerEvents: 'all',
 *       };
 *     }
 *     return null;
 *   }, []);
 *
 *   return <DynamicSVG svg={svg} width={300} getAttributes={getAttributes} />
 * }
 */
export function DynamicSVG({ svg, ...passThroughProps }: DynamicSVGProps) {
  const doc = useXMLParser(svg);
  const svgEl = useMemo(() => {
    const element = doc.children[0];
    if (element.tagName !== 'svg') {
      throw new Error(
        `Invalid SVG string provided to the DynamicSVG component: expected <svg> tag as the first children of XML document but got <${element.tagName}>.`,
      );
    }
    return element;
  }, [doc]);

  return <SVGElement element={svgEl} {...passThroughProps} />;
}
