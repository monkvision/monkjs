import { useCallback, useState } from 'react';

export default function useDamageVisibility() {
  const [visibleDamages, setVisibleDamages] = useState(true);

  const updateVisibility = useCallback((visible) => {
    setVisibleDamages(visible);
  }, []);

  return {
    visibleDamages,
    updateVisibility,
  };
}
