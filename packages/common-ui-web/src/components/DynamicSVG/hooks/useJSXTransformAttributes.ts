import { toCamelCase } from '@monkvision/common';
import { CSSProperties, useMemo } from 'react';
import { transformInlineCss } from './utils';

interface HtmlAttribute {
  key: string;
  value: string | null;
}

interface JsxAttribute {
  key: string;
  value: CSSProperties | string | null;
}

function tranformJsxAttribute(attr: HtmlAttribute): JsxAttribute {
  switch (attr.key) {
    case 'class':
      return { key: 'className', value: attr.value };
    case 'xml:space':
      return { key: 'xmlSpace', value: attr.value };
    case 'data-name':
      return { key: 'dataname', value: attr.value };
    case 'style':
      return { key: 'style', value: transformInlineCss(attr.value) };
    default:
      return { key: toCamelCase(attr.key), value: attr.value };
  }
}

/**
 * Custom hook used to map HTML attributes to their JSX counterpart (ex: "class" becomes "className", properly mapping
 * inline style values etc.).
 */
export function useJSXTransformAttributes(element: Element): JSX.IntrinsicElements {
  return useMemo(
    () =>
      element.getAttributeNames().reduce((prev, attr) => {
        const { key, value } = tranformJsxAttribute({
          key: attr,
          value: element.getAttribute(attr),
        });
        return {
          ...prev,
          [key]: value,
        } as Partial<JSX.IntrinsicElements>;
      }, {}) as JSX.IntrinsicElements,
    [element],
  );
}
