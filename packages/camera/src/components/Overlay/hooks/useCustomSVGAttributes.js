import { useMemo } from 'react';

export default function useCustomSVGAttributes({
  element,
  rootStyles,
  pathStyles,
}) {
  return useMemo(() => {
    const elementTag = element.tagName;

    if (elementTag === 'svg') {
      if (element.getAttribute('viewBox')) {
        return { style: rootStyles ?? {} };
      }
      return { style: rootStyles ?? {}, viewBox: '0 0 500 375' };
    }

    return { style: pathStyles ?? {} };
  }, [
    element,
    rootStyles,
    pathStyles,
  ]);
}
