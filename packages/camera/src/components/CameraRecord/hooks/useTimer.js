import { useEffect, useMemo, useState } from 'react';
import { useInterval } from '@monkvision/toolkit';

const ONE_SECOND = 1000;

export default function useTimer(status) {
  const [timer, setTimer] = useState(0);
  const { pending, todo, idle } = status;

  const delay = useMemo(() => (pending ? ONE_SECOND : null));
  useInterval(() => setTimer((prev) => prev + 1), delay);
  useEffect(() => { if (todo || idle) { setTimer(0); } }, [todo, idle, timer]);

  return timer;
}
