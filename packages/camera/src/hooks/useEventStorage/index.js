/**
 * This hook stores the last time a certain event was fired by the app.
 * The storage is persistent using localStorage (browser only).
 *
 * @param key The event identifier
 */
import { useCallback, useEffect, useMemo, useState } from 'react';

const EVENTS_PREFIX = '@monkvision_';

export default function useEventStorage({
  key,
}) {
  const [lastEventTimestamp, setLastEventTimestamp] = useState(null);
  const storeKey = useMemo(() => `${EVENTS_PREFIX}${key}`, [key]);

  useEffect(() => {
    const timestampStored = localStorage.getItem(storeKey);
    if (timestampStored) {
      setLastEventTimestamp(timestampStored);
    } else {
      setLastEventTimestamp(null);
    }
  }, [storeKey, setLastEventTimestamp]);

  const fireEvent = useCallback(() => {
    const timestamp = Date.now();
    localStorage.setItem(storeKey, timestamp.toString());
    setLastEventTimestamp(timestamp);
  }, [storeKey, setLastEventTimestamp]);

  return {
    lastEventTimestamp,
    fireEvent,
  };
}
