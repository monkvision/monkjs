import { useObjectMemo } from '@monkvision/common';
import { DamageType } from '@monkvision/types';
import { useState } from 'react';
import { DamagedPartDetails } from '../../../types';

/**
 * Props for the useExteriorDamage hook.
 */
export interface UseExteriorDamageProps {
  /**
   * The selected vehicle part being inspected along with its damage details.
   */
  detailedPart: DamagedPartDetails | null;
}

/**
 * State and handlers for adding exterior damage.
 */
export interface UseExteriorDamageState {
  /**
   * Indicates whether the part has damage.
   */
  hasDamage: boolean;
  /**
   * Setter for hasDamage state.
   */
  setHasDamage: (hasDamage: boolean) => void;
  /**
   * The list of damage types associated with the part.
   */
  damageTypes: DamageType[];
  /**
   * Handler when a damage type is clicked.
   */
  onDamageClicked: (damage: DamageType) => void;
  /**
   * The pricing associated with the damaged part.
   */
  pricing: number | undefined;
  /**
   * Setter for pricing state.
   */
  setPricing: (pricing: number | undefined) => void;
  /**
   * The selected vehicle part being inspected along with its damage details.
   */
  detailedPart: DamagedPartDetails | null;
}

/**
 * Custom hook to manage state for managing exterior damage state.
 */
export function useExteriorDamage({
  detailedPart,
}: UseExteriorDamageProps): UseExteriorDamageState {
  const [hasDamage, setHasDamage] = useState<boolean>(
    detailedPart ? detailedPart.damageTypes.length > 0 : false,
  );
  const [damageTypes, setDamageTypes] = useState<DamageType[]>(
    detailedPart ? detailedPart.damageTypes : [],
  );
  const [pricing, setPricing] = useState<number | undefined>(
    detailedPart ? detailedPart.pricing : undefined,
  );

  const onDamageClicked = (damage: DamageType) => {
    if (damageTypes.includes(damage)) {
      setDamageTypes(damageTypes.filter((d) => d !== damage));
    } else {
      setDamageTypes([...damageTypes, damage]);
    }
  };

  return useObjectMemo({
    hasDamage,
    setHasDamage,
    damageTypes,
    onDamageClicked,
    pricing,
    setPricing,
    detailedPart,
  });
}
