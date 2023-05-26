import { useMemo } from 'react';

function tranformJsxAttribute(key, value) {
  switch (key) {
    case 'class':
      return { key: 'className', value };
    case 'xml:space':
      return { key: 'xmlSpace', value };
    case 'style':
      return value.split(';')
        .map((style) => style.split(':'))
        .reduce((prev, curr) => {
          const [styleKey, styleValue] = curr;
          const transformedKey = styleKey.replace(/-./g, (css) => css.toUpperCase()[1]);
          return {
            ...prev,
            [transformedKey]: styleValue,
          };
        }, {});
    default:
      return { key, value };
  }
}

export default function useJSXTransformAttributes(element) {
  return useMemo(() => element
    .getAttributeNames()
    .reduce((prev, attr) => {
      const { key, value } = tranformJsxAttribute(attr, element.getAttribute(attr));
      return {
        ...prev,
        [key]: value,
      };
    }, {}), [element]);
}
