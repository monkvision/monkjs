import { useMemo, useState } from 'react';
import { useMonkState, useObjectMemo } from '@monkvision/common';
import { useInspectionReviewProvider } from '../../hooks/InspectionReviewProvider';
import { useTabViews } from '../../hooks/useTabViews';
import { InteriorDamage, InteriorViews, SelectedInteriorDamageData } from '../../types';

/**
 * State and handlers for the InteriorTab component.
 */
export interface InteriorTabState {
  /**
   * The list of interior damages.
   */
  interiorDamages: InteriorDamage[];
  /**
   * The current view in the Interior tab.
   */
  currentView: InteriorViews | string;
  /**
   * The currently selected interior damage data, or null if none is selected.
   */
  selectedDamage: SelectedInteriorDamageData | null;
  /**
   * Function to set the current view in the Interior tab.
   */
  setCurrentView: (view: InteriorViews) => void;
  /**  Handler when saving an interior damage.
   */
  handleSave: (newDamage: InteriorDamage) => void;
  /**
   * Handler when editing an existing interior damage.
   */
  editDamage: (index: number, damage: InteriorDamage) => void;
  /**
   * Handler when deleting an existing interior damage.
   */
  handleDeleteInteriorDamage: (index: number) => void;
  /**
   * Function to reset the view to the list of damages.
   */
  resetToListView: () => void;
}

/**
 * State and handlers for managing interior tab state.
 */
export function useInteriorTab(): InteriorTabState {
  const { state } = useMonkState();
  const { inspection, handleAddInteriorDamage, handleDeleteInteriorDamage } =
    useInspectionReviewProvider();
  const { currentView, setCurrentView } = useTabViews({ views: Object.values(InteriorViews) });
  const [selectedDamage, setSelectedDamage] = useState<SelectedInteriorDamageData | null>(null);

  const interiorDamages: InteriorDamage[] = useMemo(
    () =>
      (state.inspections.find((i) => i.id === inspection?.id)?.additionalData?.[
        'other_damages'
      ] as InteriorDamage[]) || [],
    [inspection, state.inspections],
  );

  const resetToListView = () => {
    setCurrentView(InteriorViews.DamagesList);
    setSelectedDamage(null);
  };

  const handleSave = (newDamage: InteriorDamage) => {
    handleAddInteriorDamage(newDamage, selectedDamage?.index);
    resetToListView();
  };

  const editDamage = (index: number, damage: InteriorDamage) => {
    setSelectedDamage({ index, damage });
    setCurrentView(InteriorViews.AddDamage);
  };

  return useObjectMemo({
    interiorDamages,
    currentView,
    selectedDamage,
    setCurrentView,
    handleSave,
    editDamage,
    handleDeleteInteriorDamage,
    resetToListView,
  });
}
