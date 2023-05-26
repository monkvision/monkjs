import { useMemo } from 'react';

export default function useCustomSVGAttributes({
  element,
  rootStyles,
  pathStyles,
}) {
  return useMemo(() => {
    const elementTag = element.tagName;

    if (elementTag === 'svg') {
      return { style: rootStyles ?? {} };
    }

    return { style: pathStyles ?? {} };
  }, [
    element,
    rootStyles,
    pathStyles,
  ]);
}
