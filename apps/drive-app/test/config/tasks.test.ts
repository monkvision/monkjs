import { Sight, TaskName } from '@monkvision/types';
import { getTasksBySight } from '../../src/config';

describe('Drive tasks config', () => {
  it('should return the default sight tasks, but with the HinL task added', () => {
    const sights = [
      { id: 'test-1', tasks: [TaskName.DAMAGE_DETECTION, TaskName.WHEEL_ANALYSIS] },
      { id: 'test-2', tasks: [TaskName.WHEEL_ANALYSIS] },
      { id: 'test-3', tasks: [TaskName.DAMAGE_DETECTION] },
      { id: 'test-4', tasks: [TaskName.DAMAGE_DETECTION, TaskName.IMAGE_EDITING] },
    ] as Sight[];
    expect(getTasksBySight(sights)).toEqual({
      'test-1': expect.arrayContaining([
        TaskName.DAMAGE_DETECTION,
        TaskName.WHEEL_ANALYSIS,
        TaskName.HUMAN_IN_THE_LOOP,
      ]),
      'test-2': expect.arrayContaining([TaskName.WHEEL_ANALYSIS, TaskName.HUMAN_IN_THE_LOOP]),
      'test-3': expect.arrayContaining([TaskName.DAMAGE_DETECTION, TaskName.HUMAN_IN_THE_LOOP]),
      'test-4': expect.arrayContaining([
        TaskName.DAMAGE_DETECTION,
        TaskName.IMAGE_EDITING,
        TaskName.HUMAN_IN_THE_LOOP,
      ]),
    });
  });
});
