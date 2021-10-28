import React, { useEffect, useLayoutEffect } from 'react';

// eslint-disable-next-line import/prefer-default-export
export const useInterval = (callback, delay) => {
  const savedCallback = React.useRef(callback);

  // Remember the latest callback if it changes.
  useLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    if (!delay) {
      return;
    }

    const id = setInterval(() => savedCallback.current(), delay);

    // eslint-disable-next-line consistent-return
    return () => clearInterval(id);
  }, [delay]);
};
