import { Severity } from '@monkvision/types';
import { useState } from 'react';

/**
 * Enumeration of the different Damage mode used in inspection report web package.
 */
export enum DamageMode {
  /**
   * Severity mode, only display severity, ignore pricing.
   */
  SEVERITY = 'severity',
  /**
   * Pricing mode, only display pricing, ignore severity.
   */
  PRICING = 'pricing',
  /**
   * Default mode, display both severity and pricing.
   */
  ALL = 'all',
}

/**
 * Enumeration of the different Display mode used in inspection report web package.
 */
export enum DisplayMode {
  /**
   * If there is no damage, both severity and pricing are hidden.
   */
  MINIMAL = 'minimal',
  /**
   * Default mode, if there is no damage display both severity and pricing as "disable".
   */
  FULL = 'full',
}

export interface DamageInfo {
  severity?: Severity;
  pricing?: number;
}

const initialDamage = {
  pricing: 1,
  severity: Severity.LOW,
};

export interface DamageManipulator {
  damage?: DamageInfo;
  onConfirm?: (damage: DamageInfo) => void;
}

/**
 * Custom hook to handle states and callback of DamageManipulator component.
 * @param damage
 * @param onConfirm
 */
export function useDamageManipulator({ damage, onConfirm }: DamageManipulator) {
  const [hasDamage, setHasDamage] = useState<boolean>(!!damage);
  const [editedDamage, setEditedDamage] = useState(damage);
  const [isShow, setIsShow] = useState(true);

  function showContent() {
    const newIsShow = !isShow;
    setIsShow(newIsShow);
  }

  function toggleDamageSwitch() {
    const newHasDamage = !hasDamage;
    setHasDamage(newHasDamage);
    setEditedDamage((prevState) => ({
      ...(prevState ?? {}),
      ...initialDamage,
      pricing: newHasDamage ? prevState?.pricing ?? initialDamage?.pricing : 0,
      severity: newHasDamage ? prevState?.severity ?? initialDamage?.severity : undefined,
    }));
  }

  function handleConfirm() {
    if (!editedDamage) {
      return;
    }
    onConfirm?.(editedDamage);
    showContent();
    console.log(editedDamage);
  }

  function handleSeverityChange(key: Severity) {
    setEditedDamage((value) => ({ ...value, severity: key }));
  }

  function handlePriceChange(price: number) {
    if (!price) {
      return;
    }
    setEditedDamage((prevState) => ({ ...prevState, pricing: price }));
  }

  function handleShowPicture() {
    console.log('handleShowPicture');
  }

  return {
    hasDamage,
    editedDamage,
    isShow,
    showContent,
    toggleDamageSwitch,
    handleConfirm,
    handleSeverityChange,
    handlePriceChange,
    handleShowPicture,
  };
}
