import { useMemo } from 'react';

function keyNameTransform(key) {
  return key.split('-')
    .map((val, index) => {
      if (index) {
        return val[0].toUpperCase() + val.substring(1).toLowerCase();
      }
      return val;
    })
    .join('');
}

function tranformJsxAttribute(key, value) {
  switch (key) {
    case 'class':
      return { key: 'className', value };
    case 'xml:space':
      return { key: 'xmlSpace', value };
    case 'data-name':
      return { key: 'dataname', value };
    case 'style':
      return {
        key: 'style',
        value: value.split(';')
          .map((style) => style.split(':'))
          .reduce((prev, curr) => {
            const [styleKey, styleValue] = curr;
            const transformedKey = styleKey.replace(/-./g, (css) => css.toUpperCase()[1]);
            return {
              ...prev,
              [transformedKey]: styleValue,
            };
          }, {}),
      };
    default:
      return { key: keyNameTransform(key), value };
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
