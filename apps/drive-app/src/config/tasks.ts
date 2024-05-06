import { Sight, TaskName } from '@monkvision/types';

const disableHinL = process.env['REACT_APP_DISABLE_HINL'] === 'true';

export function getTasksBySight(sights: Sight[]): Record<string, TaskName[]> {
  return sights.reduce(
    (tasksBySight, sight) => ({
      ...tasksBySight,
      [sight.id]: disableHinL ? sight.tasks : [...sight.tasks, TaskName.HUMAN_IN_THE_LOOP],
    }),
    {},
  );
}
