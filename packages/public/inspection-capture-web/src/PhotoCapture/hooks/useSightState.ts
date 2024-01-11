import { useState } from 'react';
import { Sight } from '@monkvision/types';
import { HUDMode } from '../hook';

/**
 * Enumeration of the different AddDamagePreview when HUD is in ADD_DAMAGE mode
 */
export enum AddDamagePreviewMode {
  /**
   * Default preview which is the Crosshair preview
   */
  DEFAULT = 'default',
  /**
   * Closeup preview
   */
  CLOSEUP_PREVIEW = 'closeup-preview',
}

/**
 * Custom hook used to initialize and manipulate sight state.
 */
export function useSightState(sights: Sight[]) {
  const [selectedSight, setSelectedSight] = useState<Sight>(sights[0]);
  const [sightsTaken, setSightsTaken] = useState<Sight[]>([]);
  const [mode, setMode] = useState<HUDMode>(HUDMode.DEFAULT);
  const [addDamagePreviewMode, setAddDamagePreviewMode] = useState<AddDamagePreviewMode>(
    AddDamagePreviewMode.DEFAULT,
  );

  const handleSightTaken = () => {
    if (mode === HUDMode.DEFAULT) {
      if (sightsTaken.includes(selectedSight)) {
        return;
      }
      const updatedSightsTaken = [...sightsTaken, selectedSight];
      setSightsTaken(updatedSightsTaken);
      const nextSight = sights.filter((sight) => !updatedSightsTaken.includes(sight))[0];
      if (nextSight) {
        setSelectedSight(nextSight);
      }
    }
    if (mode === HUDMode.ADD_DAMAGE) {
      if (addDamagePreviewMode === AddDamagePreviewMode.DEFAULT) {
        setAddDamagePreviewMode(AddDamagePreviewMode.CLOSEUP_PREVIEW);
        return;
      }
      if (addDamagePreviewMode === AddDamagePreviewMode.CLOSEUP_PREVIEW) {
        setMode(HUDMode.DEFAULT);
        setAddDamagePreviewMode(AddDamagePreviewMode.DEFAULT);
      }
    }
  };

  return {
    selectedSight,
    setSelectedSight,
    sightsTaken,
    handleSightTaken,
    mode,
    setMode,
    addDamagePreviewMode,
    setAddDamagePreviewMode,
  };
}
