import { useObjectMemo } from '@monkvision/common';
import { DamageType } from '@monkvision/types';
import { ChangeEvent, useMemo, useState } from 'react';
import { DamagedPartDetails } from '../../../types';

/**
 * Props for the useExteriorDamage hook.
 */
export interface UseExteriorDamageProps {
  /**
   * The selected vehicle part being inspected along with its damage details.
   */
  detailedPart: DamagedPartDetails | null;
  /**
   * Callback function invoked when the user indicates they are done adding damages and pricing.
   */
  handleDone: (damagedPart: DamagedPartDetails) => void;
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
   * The selected vehicle part being inspected along with its damage details.
   */
  detailedPart: DamagedPartDetails | null;
  /**
   * Indicates whether the Done button should be disabled.
   */
  isDoneDisabled: boolean;
  /**
   * Handler for pricing input change.
   */
  handlePricingChange: (e: ChangeEvent<HTMLInputElement>) => void;
  /**
   *
   */
  handleDoneClick: () => void;
}

/**
 * Custom hook to manage state for managing exterior damage state.
 */
export function useExteriorDamage({
  detailedPart,
  handleDone,
}: UseExteriorDamageProps): UseExteriorDamageState {
  const [hasDamage, setHasDamage] = useState<boolean>(
    detailedPart ? detailedPart.damageTypes.length > 0 : false,
  );
  const [damageTypes, setDamageTypes] = useState<DamageType[]>(
    detailedPart ? detailedPart.damageTypes : [],
  );
  const [pricing, setPricing] = useState<number | undefined>(
    detailedPart ? detailedPart.pricing ?? 0 : 0,
  );
  const isDoneDisabled = useMemo(
    () => hasDamage && damageTypes.length === 0,
    [hasDamage, damageTypes],
  );

  const onDamageClicked = (damage: DamageType) => {
    if (damageTypes.includes(damage)) {
      setDamageTypes(damageTypes.filter((d) => d !== damage));
    } else {
      setDamageTypes([...damageTypes, damage]);
    }
  };

  const handlePricingChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value === '' || /^\d*$/.test(value)) {
      setPricing(value === '' ? undefined : Number(value));
    }
  };

  const handleDoneClick = () => {
    if (!detailedPart) {
      return;
    }
    handleDone({ part: detailedPart.part, damageTypes, pricing, isDamaged: hasDamage });
  };

  return useObjectMemo({
    hasDamage,
    setHasDamage,
    damageTypes,
    onDamageClicked,
    pricing,
    detailedPart,
    isDoneDisabled,
    handlePricingChange,
    handleDoneClick,
  });
}
