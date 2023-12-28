import { useState } from 'react';
import { HUDMode } from '../PhotoCaptureHUD/hook';

export function useHUDMode() {
  const [mode, setMode] = useState<HUDMode>(HUDMode.DEFAULT);

  const handleAddDamage = (newMode: HUDMode) => {
    setMode(newMode);
  };
  return { mode, handleAddDamage };
}
