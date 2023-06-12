import { useMemo } from 'react';

export default function useCustomSVGAttributes({
  element,
  rootStyles,
  pathStyles,
}) {
  return useMemo(() => {
    const elementTag = element.tagName;

    const viewBox = element.getAttribute('viewBox');
    const width = element.getAttribute('width');
    const height = element.getAttribute('height');

    const additionalAttributes = {};

    if (elementTag === 'svg') {
      if (!viewBox && width && height) {
        additionalAttributes.viewBox = `0 0 ${width} ${height}`;
      }
      return { style: rootStyles ?? {}, ...additionalAttributes };
    }

    return { style: pathStyles ?? {} };
  }, [
    element,
    rootStyles,
    pathStyles,
  ]);
}
