import { useMemo } from 'react';
import { getPillDamage } from './common';

export default function useInnerHTML({ element, damages, groupId }) {
  return useMemo(() => {
    if (element.tagName === 'style' && !!element.innerHTML) {
      return element.innerHTML;
    }

    const elementClass = element.getAttribute('class');
    if (elementClass && elementClass.includes('damage-pill-text')) {
      const { damage } = getPillDamage({ damages, pillId: groupId });
      if (damage?.pricing) {
        return `${damage.pricing}€`;
      }
    }

    return null;
  }, [element, damages, groupId]);
}
