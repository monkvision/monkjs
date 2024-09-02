import { DamageType, Severity } from '@monkvision/types';
import { useEffect, useState } from 'react';

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
  isDamaged: boolean;
  needsReplacement: boolean;
  damagesType: DamageType[];
  severity?: Severity;
  pricing?: number;
}

const initialDamage = {
  pricing: 0,
  severity: Severity.LOW,
};

export interface DamageManipulator {
  damage: DamageInfo;
  show: boolean;
  onConfirm?: (damage: DamageInfo) => void;
}

/**
 * Custom hook to handle states and callback of DamageManipulator component.
 * @param damage
 * @param onConfirm
 */
export function useDamageManipulator({ damage, show, onConfirm }: DamageManipulator) {
  const [hasDamage, setHasDamage] = useState<boolean>(damage.isDamaged);
  const [listDamages, setListDamages] = useState(damage.damagesType);
  const [needsReplacement, setNeedsReplecement] = useState<boolean>(damage.needsReplacement);
  const [price, setPrice] = useState(damage.pricing);
  const [editedDamage, setEditedDamage] = useState<DamageInfo>(damage);
  const [isShow, setIsShow] = useState(show);

  function showContent() {
    const newIsShow = !isShow;
    setIsShow(newIsShow);
  }

  function toggleReplacementSwitch() {
    const newNeedsReplecement = !needsReplacement;
    setNeedsReplecement(newNeedsReplecement);
    setEditedDamage((prevState) => ({
      ...(prevState ?? {}),
      needsReplacement,
    }));
  }

  function toggleDamageSwitch() {
    const newHasDamage = !hasDamage;
    setHasDamage(newHasDamage);
    // const newList
    if (listDamages.length === 0) {
      setListDamages([DamageType.SCRATCH]);
    }
    setEditedDamage((prevState) => ({
      ...(prevState ?? {}),
      ...initialDamage,
      isDamaged: newHasDamage,
      pricing: newHasDamage ? prevState?.pricing ?? initialDamage?.pricing : 0,
      damagesType: listDamages.length === 0 ? [DamageType.SCRATCH] : listDamages,
    }));
  }

  function toggleDamage(damageSelected: DamageType) {
    let newListDamages = [...listDamages];
    if (listDamages.find((d) => d === damageSelected)) {
      newListDamages = listDamages.filter((d) => d !== damageSelected);
    } else {
      newListDamages = [...listDamages, damageSelected];
    }
    setListDamages(newListDamages);
    setEditedDamage((prevState) => ({
      ...(prevState ?? {}),
      damagesType: newListDamages,
    }));
  }

  function handleConfirm() {
    if (!editedDamage) {
      return;
    }
    onConfirm?.(editedDamage);
    showContent();
  }

  function handleSeverityChange(key: Severity) {
    setEditedDamage((value) => ({ ...value, severity: key }));
  }

  function handlePriceChange(selectedPrice: number | null) {
    // if (!price) {
    //   return;
    // }
    setPrice(selectedPrice ?? 0);
    setEditedDamage((prevState) => ({ ...prevState, pricing: selectedPrice ?? 0 }));
  }

  function handleShowPicture() {
    // console.log('handleShowPicture');
  }

  useEffect(() => {
    setIsShow(show);
    setHasDamage(damage.isDamaged);
    setListDamages(damage.damagesType);
    setPrice(damage.pricing);
    setEditedDamage(damage);
  }, [show, damage]);

  return {
    hasDamage,
    editedDamage,
    isShow,
    needsReplacement,
    listDamages,
    showContent,
    toggleDamageSwitch,
    toggleReplacementSwitch,
    toggleDamage,
    handleConfirm,
    handleSeverityChange,
    handlePriceChange,
    handleShowPicture,
  };
}
