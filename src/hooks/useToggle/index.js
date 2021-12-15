import { useCallback, useState } from 'react';

export default function useToggle() {
  const [isOn, toggle] = useState(false);

  const handleToggleOn = useCallback(() => { toggle(true); }, []);
  const handleToggleOff = useCallback((callback) => {
    toggle(false); if (typeof callback === 'function') { callback(); }
  }, []);

  return [isOn, handleToggleOn, handleToggleOff];
}
