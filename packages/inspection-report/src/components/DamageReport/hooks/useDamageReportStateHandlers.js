import { useCallback, useMemo, useState } from 'react';
import useDamageAPI from './useDamageAPI';
import { RepairOperation } from '../../../resources';

export default function useDamageReportStateHandlers({
  inspectionId,
  damages,
  setDamages,
}) {
  const [editedDamage, setEditedDamage] = useState(undefined);
  const [editedDamagePart, setEditedDamagePart] = useState(undefined);
  const [editedDamageImages, setEditedDamageImages] = useState(undefined);
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditable, setIsEditable] = useState(true);

  const state = useMemo(() => ({
    editedDamage,
    editedDamagePart,
    editedDamageImages,
    isPopUpVisible,
    isModalVisible,
    isEditable,
  }), [
    editedDamage,
    editedDamagePart,
    editedDamageImages,
    isPopUpVisible,
    isModalVisible,
    isEditable,
  ]);

  const {
    createDamage,
    updateDamage,
    deleteDamage,
  } = useDamageAPI({ inspectionId });

  const resetEditedDamageState = useCallback(() => {
    setEditedDamage(undefined);
    setEditedDamagePart(undefined);
    setEditedDamageImages(undefined);
  }, []);

  const handlePopUpDismiss = useCallback(() => {
    resetEditedDamageState();
    setIsPopUpVisible(false);
  }, []);

  const handleShowGallery = useCallback(() => {
    setIsPopUpVisible(false);
    setIsModalVisible(true);
  }, []);

  const handleGalleryDismiss = useCallback(() => {
    resetEditedDamageState();
    setIsModalVisible(false);
  }, []);

  const handlePartPressed = useCallback((partName) => {
    if (isEditable) {
      const damage = damages.find((dmg) => dmg.part === partName);
      if (!damage || !damage?.pricing) {
        setEditedDamagePart(partName);
        setEditedDamageImages([]);
        setIsPopUpVisible(true);
      }
    }
  }, [isEditable, damages]);

  const handlePillPressed = useCallback((partName) => {
    const damage = damages.find((dmg) => dmg.part === partName);
    if (!damage) {
      throw new Error(`Unable to find damage with corresponding pill part "${partName}"`);
    }
    setEditedDamage(damage);
    setEditedDamagePart(partName);
    setEditedDamageImages(damage.images);
    setIsPopUpVisible(true);
  }, [damages]);

  const handleRemoveDamage = useCallback(() => {
    const damage = damages.find((dmg) => dmg.part === editedDamagePart);
    const newDamages = damages.filter((dmg) => dmg.part !== editedDamagePart);
    setDamages(newDamages);
    if (damage) {
      deleteDamage(damage.id).then(() => {
        setDamages((dmgs) => [
          ...dmgs,
          { ...damage, pricing: 0, severity: 'low', repairOperation: RepairOperation.REPAIR },
        ]);
      }).catch((err) => {
        console.error(err);
        setDamages((dmgs) => [...dmgs, damage]);
      });
    }
  }, [damages, editedDamagePart, deleteDamage]);

  const handleCreateDamage = useCallback((damage) => {
    setDamages((dmgs) => [...dmgs, damage]);
    createDamage(damage).then((res) => {
      const id = res.data.id;
      setDamages((dmgs) => dmgs.map((dmg) => (dmg.part === damage.part ? { ...dmg, id } : dmg)));
    }).catch((err) => {
      console.error(err);
      setDamages((dmgs) => dmgs.filter((dmg) => dmg.part !== damage.part));
    });
  }, [createDamage]);

  const handleUpdateDamage = useCallback((damage) => {
    const newDmgs = [...damages];
    const editedIndex = newDmgs.findIndex((dmg) => dmg.part === damage.part);
    const oldValues = { ...newDmgs[editedIndex] };
    newDmgs[editedIndex] = damage;
    setDamages(newDmgs);
    updateDamage(damage).catch((err) => {
      console.error(err);
      setDamages((dmgs) => {
        const fixedDmgs = [...dmgs];
        const fixedIndex = fixedDmgs.findIndex((dmg) => dmg.part === damage.part);
        fixedDmgs[fixedIndex] = oldValues;
        return fixedDmgs;
      });
    });
  }, [damages, updateDamage]);

  const handleSaveDamage = useCallback((partialDamage) => {
    if (isEditable) {
      if (!partialDamage?.pricing && !partialDamage?.severity) {
        // Removing the damage
        handleRemoveDamage();
      } else {
        // Creating or updating a damage
        const damage = {
          part: editedDamagePart,
          images: editedDamageImages,
          ...partialDamage,
        };
        if (!editedDamage) {
          // Creating a new displayed damage
          const hiddenDamage = damages.find((dmg) => dmg.part === damage.part);
          if (hiddenDamage) {
            // A damage already existed for this part, it was just hidden with a pricing = 0
            damage.id = hiddenDamage.id;
            handleUpdateDamage(damage);
          } else {
            // Creating a completely new damage
            handleCreateDamage(damage);
          }
        } else {
          // Editing a damage
          handleUpdateDamage(damage);
        }
      }
    }
    resetEditedDamageState();
    setIsPopUpVisible(false);
    setIsModalVisible(false);
  }, [
    isEditable,
    handleRemoveDamage,
    editedDamagePart,
    editedDamageImages,
    editedDamage,
    handleCreateDamage,
    handleUpdateDamage,
    resetEditedDamageState,
    setIsPopUpVisible,
    setIsModalVisible,
    damages,
  ]);

  return {
    state,
    handlePopUpDismiss,
    handleShowGallery,
    handleGalleryDismiss,
    handlePartPressed,
    handlePillPressed,
    handleSaveDamage,
    setIsEditable,
  };
}
