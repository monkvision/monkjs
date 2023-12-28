import { Sight } from '@monkvision/types';
import { useState } from 'react';

/**
 * Custom hook used to initialize and manipulate sight state.
 */
export function useSightState(sights: Sight[]) {
  const [sightSelected, setSightSelected] = useState<Sight>(sights[0]);
  const [sightsTaken, setSightsTaken] = useState<Sight[]>([]);

  const handleSightSelected = (sight: Sight): void => {
    setSightSelected(sight);
  };

  const handleSightTaken = (): void => {
    if (!sightSelected || sightsTaken.includes(sightSelected)) {
      return;
    }

    setSightsTaken((prevSightsTaken) => {
      const updatedSightsTaken = [...prevSightsTaken, sightSelected];

      const sightsNotTaken = sights.filter((sight) => !updatedSightsTaken.includes(sight));
      const nextSight = sightsNotTaken[0];

      if (nextSight) {
        handleSightSelected(nextSight);
      }

      return updatedSightsTaken;
    });
  };

  return {
    sightSelected,
    handleSightSelected,
    sightsTaken,
    handleSightTaken,
  };
}
