import { Sight } from '@monkvision/types';
import { useEffect, useState } from 'react';

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
    setSightsTaken((value) => [...value, selectedSight]);
  };
  useEffect(() => {
    const nextSight = sights.filter((sight) => !sightsTaken.includes(sight))[0];
    if (nextSight) {
      setSelectedSight(nextSight);
    }
  }, [sightsTaken]);

  return {
    selectedSight,
    setSelectedSight,
    sightsTaken,
    handleSightTaken,
  };
}
