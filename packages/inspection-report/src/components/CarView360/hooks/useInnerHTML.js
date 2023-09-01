import { useMemo } from 'react';
import { getPillDamage } from './common';
import { RepairOperation } from '../../../resources';
import { useCurrency } from '../../../hooks';

export default function useInnerHTML({ element, damages, groupId }) {
  const { formateValue } = useCurrency();

  return useMemo(() => {
    if (element.tagName === 'style' && !!element.innerHTML) {
      return element.innerHTML;
    }

    const elementClass = element.getAttribute('class');
    if (elementClass && elementClass.includes('damage-pill-text')) {
      const { damage } = getPillDamage({ damages, pillId: groupId });
      if (damage?.pricing) {
        return formateValue(damage.pricing);
      }
      if (damage?.repairOperation === RepairOperation.REPLACE) {
        return `🔄`;
      }
    }

    return null;
  }, [element, damages, groupId]);
}
