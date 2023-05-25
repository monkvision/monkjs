import { useMemo } from 'react';

const jsxSpecialAttributes = {
  class: 'className',
};

export default function useJSXSpecialAttributes(element) {
  return useMemo(() => element
    .getAttributeNames()
    .reduce((prev, attr) => {
      const attribute = jsxSpecialAttributes[attr] ?? attr;
      return {
        ...prev,
        [attribute]: element.getAttribute(attr),
      };
    }, {}), [element]);
}
