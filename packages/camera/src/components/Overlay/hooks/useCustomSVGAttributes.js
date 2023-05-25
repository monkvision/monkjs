import { useMemo } from 'react';

const styles = {
  hidden: { display: 'none' },
  pill: { cursor: 'pointer' },
  pillChild: { cursor: 'pointer' },
};
console.log('styles =', styles);

export default function useCustomSVGAttributes({
  element,
  getAttributes,
}) {
  return useMemo(() => {
    const elementTag = element.tagName;

    if (['svg', 'g'].includes(elementTag)) {
      return { pointerEvents: 'box-none' };
    }

    return {};
  }, [
    element,
    getAttributes,
  ]);
}
