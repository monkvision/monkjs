import { useMemo } from 'react';

const jsxSpecialAttributes: Record<string, string> = {
  class: 'className',
};

/**
 * Custom hook used to map HTML attributes to their JSX name counterpart (ex: "class" becomes "className" etc.).
 */
export function useJSXMapttributes(element: Element) {
  return useMemo(
    () =>
      element.getAttributeNames().reduce((prev, attr) => {
        const attribute = jsxSpecialAttributes[attr] ?? attr;
        return {
          ...prev,
          [attribute]: element.getAttribute(attr),
        };
      }, {}),
    [element],
  );
}
