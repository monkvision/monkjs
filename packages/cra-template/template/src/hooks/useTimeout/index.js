import React from 'react';

export default function useTimeout(callback, delay) {
  const timeoutRef = React.useRef(null);
  const savedCallback = React.useRef(callback);

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    if (typeof delay !== 'number') { return undefined; }

    const tick = () => savedCallback.current();
    timeoutRef.current = setTimeout(tick, delay);

    return () => clearTimeout(timeoutRef.current);
  }, [delay]);

  return timeoutRef;
}
