import { useEffect, useMemo, useRef, useState } from 'react';
import { useInterval } from '@monkvision/toolkit';

const ONE_SECOND = 1000;

const useTimer = (isRecording) => {
  const [timer, setTimer] = useState(0);

  const delay = useMemo(() => (isRecording ? ONE_SECOND : null));
  useInterval(() => setTimer((prev) => prev + 1), delay);
  useEffect(() => { if (!isRecording) { setTimer(0); } }, [isRecording, timer]);

  return timer;
};

export default function useRecord() {
  const [isRecording, setIsRecording] = useState(false);
  const timer = useTimer(isRecording);

  const ref = useRef();

  return { isRecording, setIsRecording, ref, timer };
}
