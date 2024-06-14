import { useEffect } from 'react';

export function PreventExit() {
  useEffect(() => {
    window.onbeforeunload = () => {
      return 'Are you sure you want to leave?';
    };
    return () => {
      window.onbeforeunload = null;
    };
  }, []);
  return null;
}
