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
    let customRootStyles = rootStyles;

    if (elementTag === 'svg') {
      if (!viewBox && width && height) {
        additionalAttributes.viewBox = `0 0 ${width} ${height}`;
        customRootStyles = { ...rootStyles, width: 'inherit' };
      }

      return { style: customRootStyles ?? {}, ...additionalAttributes };
    }

    return { style: pathStyles ?? {} };
  }, [
    element,
    rootStyles,
    pathStyles,
  ]);
}
