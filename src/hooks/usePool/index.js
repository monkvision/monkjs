import { useState, useCallback } from 'react';

const DEFAULT_POOL = 60000; // 1 min

export const usePool = () => {
  const [pool, setPool] = useState();

  const startPool = useCallback((func, every = DEFAULT_POOL) => {
    if (pool) { return; }
    func();
    const timer = setInterval(() => func(), every);
    setPool(timer);
  }, [pool]);

  const isPooling = () => pool !== undefined;

  const clearPool = () => clearInterval(pool);

  return {
    startPool,
    isPooling,
    clearPool,
  };
};

export default usePool;
