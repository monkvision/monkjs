import { useState, useRef, useEffect, useLayoutEffect } from 'react';

const useInterval = (callback, delay) => {
  const [intervalId, setIntervalId] = useState();
  const savedCallback = useRef(callback);

  // Remember the latest callback if it changes.
  useLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    if (!delay) {
      return undefined;
    }
    const id = setInterval(() => savedCallback.current(), delay);
    setIntervalId(id);

    return () => clearInterval(id);
  }, [delay]);

  return intervalId;
};

export default useInterval;
