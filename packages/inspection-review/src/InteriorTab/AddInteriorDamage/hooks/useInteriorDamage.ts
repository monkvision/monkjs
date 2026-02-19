import { useObjectMemo } from '@monkvision/common';
import { useState } from 'react';
import { InteriorDamage, SelectedInteriorDamageData } from '../../../types';

/**
 * State and handlers for adding interior damage.
 */
export interface InteriorDamageState {
  /**
   * The current interior damage being added or edited.
   */
  currentDamage: InteriorDamage | null;
  /**
   * Handler for updating the current interior damage state.
   */
  handleInputChange: (value: Partial<InteriorDamage>) => void;
}

/**
 * Props for the useInteriorDamage hook.
 */
export interface InteriorDamageProps {
  /**
   * The interior damage data to be edited, or null if adding new damage.
   */
  damageData: SelectedInteriorDamageData | null;
}

/**
 * State and handlers for managing interior damage state.
 */
export function useInteriorDamage({ damageData }: InteriorDamageProps): InteriorDamageState {
  const [currentDamage, setCurrentDamage] = useState<InteriorDamage | null>(
    damageData?.damage ?? null,
  );

  const handleInputChange = (value: Partial<InteriorDamage>) => {
    if (currentDamage) {
      setCurrentDamage({
        ...currentDamage,
        ...value,
      });
    } else {
      setCurrentDamage({
        area: value.area || '',
        damage_type: value.damage_type || '',
        repair_cost: value.repair_cost || null,
      });
    }
  };

  return useObjectMemo({
    currentDamage,
    handleInputChange,
  });
}
