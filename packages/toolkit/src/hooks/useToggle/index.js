import { useCallback, useState } from 'react';

export default function useToggle(initialValue = false) {
  const [isSet, toggle] = useState(initialValue);

  const handleSet = useCallback(() => { toggle(true); }, []);
  const handleUnset = useCallback((callback) => {
    toggle(false); if (typeof callback === 'function') { callback(); }
  }, []);
  const handleToggle = useCallback(() => { toggle((prev) => !prev); }, []);

  return [isSet, handleSet, handleUnset, handleToggle];
}
