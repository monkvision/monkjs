import { useMemo } from 'react';

import CAR_PARTS from './carParts';

const SELECTED_FILL_COLOR = '#ADE0FFB3';

export default function useCustomSVGAttributes({ element, togglePart, isPartSelected, groupName }) {
  return useMemo(() => {
    if (['svg', 'g'].includes(element.tagName)) {
      return { pointerEvents: 'box-none' };
    }

    const elementClass = element.getAttribute('class');
    const elementId = element.getAttribute('id');
    let partKey = null;

    if (groupName && CAR_PARTS.includes(groupName)) {
      partKey = groupName;
    }

    if (elementClass && elementClass.includes('selectable') && CAR_PARTS.includes(elementId)) {
      partKey = elementId;
    }

    if (partKey) {
      const style = isPartSelected(partKey) ? { fill: SELECTED_FILL_COLOR } : undefined;
      const onClick = () => togglePart(partKey);

      return {
        pointerEvents: 'all',
        onClick,
        style,
      };
    }

    return {};
  }, [element, togglePart, isPartSelected, groupName]);
}
