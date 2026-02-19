import { useObjectMemo } from '@monkvision/common';
import { useMemo, useState } from 'react';
import { InteriorDamage } from '../../../types';
import { InteriorTabState } from '../../hooks/useInteriorTab';

/**
 * State and handlers for adding interior damage.
 */
export interface InteriorDamageState {
  /**
   * The current interior damage being added or edited.
   */
  currentDamage: InteriorDamage;
  /**
   * Indicates whether the Done button should be disabled.
   */
  isDoneDisabled: boolean;
  /**
   * Handler for updating the current interior damage state.
   */
  handleInputChange: (value: Partial<InteriorDamage>) => void;
  /**
   * Handler invoked when the user is done adding/editing the interior damage.
   */
  handleDone: () => void;
}

/**
 * Props for the useInteriorDamage hook.
 */
export type InteriorDamageProps = Pick<InteriorTabState, 'selectedDamage' | 'onSave'>;

const defaultInteriorDamage: InteriorDamage = {
  area: '',
  damage_type: '',
  repair_cost: 0,
};

/**
 * State and handlers for managing interior damage state.
 */
export function useInteriorDamage({
  selectedDamage,
  onSave,
}: InteriorDamageProps): InteriorDamageState {
  const [currentDamage, setCurrentDamage] = useState<InteriorDamage>(
    selectedDamage?.damage ?? defaultInteriorDamage,
  );
  const isDoneDisabled = useMemo(
    () => !currentDamage || !currentDamage.area || !currentDamage.damage_type,
    [currentDamage],
  );

  const handleInputChange = (value: Partial<InteriorDamage>) => {
    setCurrentDamage({
      ...currentDamage,
      ...value,
    });
  };

  const handleDone = () => {
    if (!isDoneDisabled) {
      onSave(currentDamage);
    }
  };

  return useObjectMemo({
    currentDamage,
    isDoneDisabled,
    handleInputChange,
    handleDone,
  });
}
