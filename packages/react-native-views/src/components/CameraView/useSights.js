import { useMemo, useState } from 'react';
import { Sight } from '@monkvision/corejs';

export default function useSights(sights, active = 0) {
  const [activeSightIndex, setActiveSightIndex] = useState(active);

  const activeSight = useMemo(
    () => new Sight(...sights[activeSightIndex]),
    [activeSightIndex, sights],
  );

  const setPrevSight = () => setActiveSightIndex((prevIndex) => prevIndex - 1);
  const setNextSight = () => setActiveSightIndex((prevIndex) => prevIndex + 1);

  const disablePrev = useMemo(
    () => activeSightIndex === 0,
    [activeSightIndex],
  );

  const disableNext = useMemo(
    () => activeSightIndex === sights.length - 1,
    [activeSightIndex, sights.length],
  );

  return {
    count: sights.length,

    activeSightIndex,
    activeSight,

    setPrevSight,
    setNextSight,

    prevSightProps: {
      disabled: disablePrev,
      onPress: setPrevSight,
    },
    nextSightProps: {
      disabled: disableNext,
      onPress: setNextSight,
    },
  };
}
