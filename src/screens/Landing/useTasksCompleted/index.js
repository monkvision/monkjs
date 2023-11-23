import monk from '@monkvision/corejs';
import { useMemo } from 'react';

const REQUIRED_INSPECTION_TASKS_FOR_PDF = [
  'damage_detection',
  'wheel_analysis',
  'images_ocr',
  'repair_estimate',
  'pricing',
  'dashboard_ocr',
];

function isTaskDone(task, inspection) {
  switch (task.name) {
    case 'images_ocr':
      return task.status === monk.types.ProgressStatus.DONE
        || (task.status === monk.types.ProgressStatus.NOT_STARTED && !!inspection.vehicle.vin);
    default:
      return task.status === monk.types.ProgressStatus.DONE;
  }
}

export default function useInspectionTasksStatus(inspection) {
  return useMemo(() => {
    let isDone = false;
    let isError = false;
    const tasks = inspection?.tasks
      .filter((task) => REQUIRED_INSPECTION_TASKS_FOR_PDF.includes(task)) ?? [];
    const tasksInError = tasks
      .filter((task) => task.status === monk.types.ProgressStatus.ERROR)
      .map((task) => task.name);
    if (tasksInError.length > 0) {
      isError = true;
    } else if (tasks.length > 0 && tasks.every((task) => isTaskDone(task, inspection))) {
      isDone = true;
    }
    return {
      isDone,
      isError,
      tasksInError,
    };
  }, [inspection]);
}
