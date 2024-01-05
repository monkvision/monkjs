import { useState } from 'react';
import { Sight } from '@monkvision/types';

/**
 * Custom hook used to initialize and manipulate sight state.
 */
export function useSightState(sights: Sight[]) {
  const [selectedSight, setSelectedSight] = useState<Sight>(sights[0]);
  const [sightsTaken, setSightsTaken] = useState<Sight[]>([]);

  const handleSightTaken = () => {
    if (sightsTaken.includes(selectedSight)) {
      return;
    }
    const updatedSightsTaken = [...sightsTaken, selectedSight];
    setSightsTaken(updatedSightsTaken);
    const nextSight = sights.filter((sight) => !updatedSightsTaken.includes(sight))[0];
    if (nextSight) {
      setSelectedSight(nextSight);
    }
  };

  return {
    selectedSight,
    setSelectedSight,
    sightsTaken,
    handleSightTaken,
  };
}
