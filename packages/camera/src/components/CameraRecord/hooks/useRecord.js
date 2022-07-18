import { useCallback, useMemo, useState } from 'react';

const statuses = {
  CANCELED: 'CANCELED',
  CUTTING: 'CUTTING',
  FINISHED: 'FINISHED',
  IN_PROGRESS: 'IN_PROGRESS',
  NOT_STARTED: 'NOT_STARTED',
  PAUSED: 'PAUSED',
  TODO: 'TODO',
  TO_RESUME: 'TO_RESUME',
};

const ignoreAwaitedStatuses = (prev, status) => {
  switch (prev) {
    case statuses.PAUSED:
    case statuses.CANCELED:
    case statuses.FINISHED:
      return prev;

    default:
      return status;
  }
};

export default function useRecord() {
  const [status, setStatus] = useState(statuses.NOT_STARTED);

  const ready = useCallback(() => setStatus(statuses.TODO), []);
  const cancel = useCallback(() => setStatus(statuses.CANCELED), []);
  const finish = useCallback(() => setStatus(statuses.FINISHED), []);
  const reset = useCallback(() => setStatus(statuses.NOT_STARTED), []);
  const start = useCallback(() => setStatus(
    (prev) => ignoreAwaitedStatuses(prev, statuses.IN_PROGRESS),
  ), []);
  const cut = useCallback(() => setStatus(
    (prev) => ignoreAwaitedStatuses(prev, statuses.CUTTING),
  ), []);

  const currentStatus = useMemo(() => ({
    canceled: status === statuses.CANCELED,
    cutting: status === statuses.CUTTING,
    finished: status === statuses.FINISHED,
    idle: status === statuses.NOT_STARTED,
    paused: status === statuses.PAUSED,
    pending: status === statuses.IN_PROGRESS,
    todo: status === statuses.TODO,
    resuming: status === statuses.TO_RESUME,
  }), [status]);

  return { start, ready, cancel, finish, reset, cut, status: currentStatus };
}
