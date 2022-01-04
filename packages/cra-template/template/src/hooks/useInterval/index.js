import React from 'react';

const useInterval = (callback, delay) => {
  const savedCallback = React.useRef(callback);

  // Remember the latest callback if it changes.
  React.useLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    // Don't schedule if no delay is specified.
    if (!delay) {
      return undefined;
    }
    const id = setInterval(() => savedCallback.current(), delay);

    return () => clearInterval(id);
  }, [delay]);
};
export default useInterval;
