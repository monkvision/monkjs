import { SVGProps } from 'react';

/**
 * Customization options available to customize a DynamicSVG : you can add custom properties to SVG tags based on their
 * attributes, groups etc.
 */
export interface DynamicSVGCustomizationFunctions {
  /**
   * A callback used to customize SVG tags in a DynamicSVG component based on the HTMLElement itself, or the IDs of the
   * groups this element is part of.
   *
   * @param element The element to apply the custom attributes to.
   * @param groupIds The IDs of the SVG group elements this element is part of (the IDs are in order).
   * @return This callback should return a set of custom HTML attributes to pass to the element or `null` for no
   * attributes.
   */
  getAttributes?: (element: SVGElement, groupIds: string[]) => SVGProps<SVGElement>;
  /**
   * A callback used to customize the inner text of SVG tags in a DynamicSVG component based on the HTMLElement itself,
   * or the IDs of the groups this element is part of.
   *
   * @param element The element to set the innerText.
   * @param groupIds The IDs of the SVG group elements this element is part of (the IDs are in order).
   * @return This callback should return a string to use for the innerText of the element or `null` for no innerText.
   */
  getInnerText?: (element: SVGSVGElement, groupIds: string[]) => string | null;
}

/**
 * Custom props that need to be passed to the SVGElement component in order for it to properly display the SVG tag it is
 * given.
 */
export interface SVGElementCustomProps {
  /**
   * The HTMLElement representing the SVG tag that the SVGElement is supposed to display.
   */
  element: SVGSVGElement;
  /**
   * The IDs of the SVG groups this element is part of (in order).
   *
   * @default []
   */
  groupIds?: string[];
}
