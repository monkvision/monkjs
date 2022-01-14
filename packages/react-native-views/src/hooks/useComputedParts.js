import { useMemo } from 'react';
import camelCase from 'lodash.camelcase';

import { vehiclePartsNames } from '@monkvision/react-native';

export default function useComputedParts(partsWithDamages) {
  const activeParts = useMemo(
    () => partsWithDamages.map((part) => camelCase(part.partType)),
    [partsWithDamages],
  );

  return useMemo(() => {
    const parts = { front: 0, back: 0, interior: 0 };

    activeParts.forEach((item) => {
      if (vehiclePartsNames.front.some((e) => e === item)) { parts.front += 1; }
      if (vehiclePartsNames.back.some((e) => e === item)) { parts.back += 1; }
      if (vehiclePartsNames.interior.some((e) => e === item)) { parts.interior += 1; }
    });

    return parts;
  }, [activeParts]);
}
