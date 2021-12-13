import { useCallback, useState } from 'react';

export default function useToggle() {
  const [isOn, toggle] = useState(false);

  const handleToggleOn = useCallback(() => { toggle(true); }, []);
  const handleToggleOff = useCallback(() => { toggle(false); }, []);

  return [isOn, handleToggleOn, handleToggleOff];
}
