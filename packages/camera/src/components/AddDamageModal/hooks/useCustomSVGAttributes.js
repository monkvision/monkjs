import { useMemo } from 'react';

import CAR_PARTS from './carParts';

const SELECTED_FILL_COLOR = '#ADE0FFB3';

export default function useCustomSVGAttributes({ element, togglePart, isPartSelected }) {
  return useMemo(() => {
    if (element.tagName === 'svg') {
      return { pointerEvents: 'box-none' };
    }

    if (element.tagName === 'path') {
      const onClick = CAR_PARTS.includes(element.getAttribute('id'))
        ? () => togglePart(element.getAttribute('id')) : undefined;
      const style = isPartSelected(element.getAttribute('id'))
        ? { fill: SELECTED_FILL_COLOR } : undefined;
      return {
        pointerEvents: 'all',
        onClick,
        style,
      };
    }

    return {};
  }, [element, togglePart, isPartSelected]);
}
