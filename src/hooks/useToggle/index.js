import { useCallback, useState } from 'react';

export default function useToggle(initialState = false) {
  const [isOn, toggle] = useState(initialState);

  const handleToggleOn = useCallback(() => { toggle(true); }, []);
  const handleToggleOff = useCallback(() => { toggle(false); }, []);

  return [isOn, handleToggleOn, handleToggleOff];
}
