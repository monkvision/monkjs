/**
 * This hook stores the last time a certain event was fired by the app.
 * The storage is persistent using localStorage (browser only).
 *
 * @param key The event identifier
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

const EVENTS_PREFIX = '@monkvision_';
const savedEvents = {};

export default function useEventStorage({
  key,
}) {
  const [lastEventTimestamp, setLastEventTimestamp] = useState(null);
  const storeKey = useMemo(() => `${EVENTS_PREFIX}${key}`, [key]);

  useEffect(() => {
    let timestampStored;
    if (Platform.OS === 'web') {
      timestampStored = localStorage.getItem(storeKey);
    } else {
      timestampStored = savedEvents.storeKey;
    }
    if (timestampStored) {
      setLastEventTimestamp(timestampStored);
    } else {
      setLastEventTimestamp(null);
    }
  }, [storeKey, setLastEventTimestamp]);

  const fireEvent = useCallback(() => {
    const timestamp = Date.now();
    if (Platform.OS === 'web') {
      localStorage.setItem(storeKey, timestamp.toString());
    } else {
      savedEvents.storeKey = timestamp.toString();
    }
    setLastEventTimestamp(timestamp);
  }, [storeKey, setLastEventTimestamp]);

  return {
    lastEventTimestamp,
    fireEvent,
  };
}
