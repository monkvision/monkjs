import { useMemo } from 'react';
import { RepairOperation } from '../../../../resources';

export default function useDamageCounts(damages) {
  return useMemo(
    () => damages.reduce(
      (prev, curr) => {
        const counts = { ...prev };
        const key = curr.severity ?? 'none';
        counts[key] += (!curr.pricing && curr.repairOperation === RepairOperation.REPAIR) ? 0 : 1;
        return counts;
      },
      { low: 0, medium: 0, high: 0, none: 0 },
    ),
    [damages],
  );
}
