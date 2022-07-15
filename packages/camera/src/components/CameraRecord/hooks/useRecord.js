import { useMemo, useState } from 'react';

const statuses = {
  NOT_STARTED: 'NOT_STARTED',
  TODO: 'TODO',
  CUTTING: 'CUTTING',
  IN_PROGRESS: 'IN_PROGRESS',
  FINISHED: 'FINISHED',
  CANCELED: 'CANCELED',
};

export default function useRecord() {
  const [status, setStatus] = useState(statuses.NOT_STARTED);
  console.log(status);
  const start = () => setStatus(statuses.IN_PROGRESS);
  const cut = () => setStatus(statuses.CUTTING);
  const ready = () => setStatus(statuses.TODO);
  const cancel = () => setStatus(statuses.CANCELED);
  const finish = (s) => setStatus(s || statuses.FINISHED);
  const reset = () => setStatus(statuses.NOT_STARTED);

  const currentStatus = useMemo(() => ({
    idle: status === 'NOT_STARTED',
    pending: status === 'IN_PROGRESS',
    cutting: status === 'CUTTING',
    todo: status === 'TODO',
    canceled: status === 'CANCELED',
    finished: status === 'FINISHED',
  }), [status]);

  return { start, ready, cancel, finish, reset, cut, status: currentStatus };
}
