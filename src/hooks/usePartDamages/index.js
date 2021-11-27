import isEmpty from 'lodash.isempty';
import { useMemo } from 'react';

export default function usePartDamages(parts, damages) {
  return useMemo(() => Object.values(parts)
    .filter((part) => !isEmpty(part.damageIds))
    .map((part) => ({
      ...part,
      damages: Object.values(damages)
        .filter((damage) => damage.partIds?.includes(part.id)),
    })), [parts, damages]);
}
