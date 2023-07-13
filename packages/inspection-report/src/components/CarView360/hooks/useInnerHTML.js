import { useMemo } from 'react';
import { getPillDamage } from './common';
import { RepairOperation } from '../../../resources';

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
      if (damage?.repairOperation === RepairOperation.REPLACE) {
        return `🔄`;
      }
    }

    return null;
  }, [element, damages, groupId]);
}
