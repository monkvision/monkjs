import { JSX } from 'react';
import { JSXIntrinsicSVGElements } from '@monkvision/types';
import {
  DynamicSVGCustomizationFunctions,
  SVGElementCustomProps,
  useCustomAttributes,
  useInnerHTML,
  useJSXTransformAttributes,
} from './hooks';

/**
 * Type definition for the props accepted by the SVGElement component. It is a union of the following types :
 * - The props accepted by the intrinsic JSX element representing the encapsulated SVG tag.
 * - Customization functions used to customize the attributes and inner HTML of the encapsulated SVG tag.
 * - Custom props like the element to display itself, parent group ids etc.
 */
export type SVGElementProps<T extends keyof JSXIntrinsicSVGElements> = JSX.IntrinsicElements[T] &
  DynamicSVGCustomizationFunctions &
  SVGElementCustomProps;

function getChildrenGroupIds({ element, groupIds }: Required<SVGElementCustomProps>): string[] {
  const id = element.getAttribute('id');
  return element.tagName === 'g' && id ? [...groupIds, id] : groupIds;
}

/**
 * A custom component used to encapsulate an SVG element (usually parsed from a string using the `useXMLParser` hook).
 * It displays the SVG element as well as its children, and applies cusotm properties to it so that the whole SVG image
 * can be customized dynamically.
 *
 * *Note : As a developer using the MonkJs SDK, you probably don't need to use this component anywhere in your code. If
 * you need to display a dynamic SVG, you can directly use the DynamicSVG component available and exported in this
 * package, that will handle the XML parsing for you.*
 */
export function SVGElement<T extends keyof JSXIntrinsicSVGElements = 'svg'>({
  element,
  groupIds = [],
  getAttributes,
  getInnerText,
  ...passThroughProps
}: SVGElementProps<T>) {
  const Tag = element.tagName as T;
  const attributes = useJSXTransformAttributes(element);
  const customAttributes = useCustomAttributes({
    element,
    groupIds,
    getAttributes,
    style: attributes.style ?? {},
  });
  const tagAttr = { ...attributes, ...customAttributes, ...passThroughProps } as any;
  const innerHTML = useInnerHTML({ element, groupIds, getInnerText });
  const childrenGroupIds = getChildrenGroupIds({ element, groupIds });

  return (
    <Tag {...tagAttr}>
      {[
        innerHTML,
        ...Array.from(element.children).map((child, id) => (
          <SVGElement
            key={id.toString()}
            element={child as SVGSVGElement}
            groupIds={childrenGroupIds}
            getAttributes={getAttributes}
            getInnerText={getInnerText}
          />
        )),
      ]}
    </Tag>
  );
}
