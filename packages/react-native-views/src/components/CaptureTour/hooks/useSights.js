import { useMemo, useState } from 'react';

/**
 * Wraps states and callbacks to manage Sights in one hook place
 * @param sights
 * @param active
 * @returns {{
 *   activeSight: object,
 *   nextSightProps: {onPress: function, disabled: boolean},
 *   setPrevSight: function,
 *   prevSightProps: {onPress: function, disabled: boolean},
 *   count,
 *   setNextSight: function,
 *   activeSightIndex: number,
 * }}
 */
export default function useSights(sights, active = 0) {
  const [activeSightIndex, setActiveSightIndex] = useState(active);

  const activeSight = useMemo(
    () => sights[activeSightIndex],
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
