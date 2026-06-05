import { useObjectMemo } from '@monkvision/common';
import { DamageType } from '@monkvision/types';
import { ChangeEvent, useMemo, useState } from 'react';
import { DamagedPartDetails, InspectionReviewProviderState } from '../../../../types';
import { TabExteriorState } from '../../hooks/useExteriorTab';

/**
 * Props for the useExteriorDamage hook.
 */
export interface UseExteriorDamageProps
  extends Pick<TabExteriorState, 'onDone'>,
    Pick<InspectionReviewProviderState, 'selectedExteriorPart'> {}

/**
 * State and handlers for adding exterior damage.
 */
export interface UseExteriorDamageState {
  /**
   * Indicates whether the part has damage.
   */
  hasDamage: boolean;
  /**
   * The list of damage types associated with the part.
   */
  damageTypes: DamageType[];
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
   * Setter for hasDamage state.
   */
  setHasDamage: (hasDamage: boolean) => void;
  /**
   * Handler when a damage type is clicked.
   */
  onDamageClicked: (damage: DamageType) => void;
  /**
   * Handler for pricing input change.
   */
  handlePricingChange: (e: ChangeEvent<HTMLInputElement>) => void;
  /**
   * Handler for the Done button click event.
   */
  handleDoneClick: () => void;
}

/**
 * Custom hook to manage state for managing exterior damage state.
 */
export function useExteriorDamage({
  selectedExteriorPart,
  onDone,
}: UseExteriorDamageProps): UseExteriorDamageState {
  const [hasDamage, setHasDamage] = useState<boolean>(
    selectedExteriorPart
      ? selectedExteriorPart.damageTypes.length > 0 || selectedExteriorPart.pricing !== undefined
      : false,
  );
  const [damageTypes, setDamageTypes] = useState<DamageType[]>(
    selectedExteriorPart ? selectedExteriorPart.damageTypes : [],
  );
  const [pricing, setPricing] = useState<number | undefined>(
    selectedExteriorPart ? selectedExteriorPart.pricing ?? 0 : 0,
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
    if (!selectedExteriorPart) {
      return;
    }
    onDone({ part: selectedExteriorPart.part, damageTypes, pricing, isDamaged: hasDamage });
  };

  return useObjectMemo({
    hasDamage,
    setHasDamage,
    damageTypes,
    onDamageClicked,
    pricing,
    detailedPart: selectedExteriorPart,
    isDoneDisabled,
    handlePricingChange,
    handleDoneClick,
  });
}
