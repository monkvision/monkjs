import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRequest } from '@monkvision/toolkit';
import monk from '@monkvision/corejs';

export const TASKS_BY_MOD = {
  vinNumber: ['images_ocr'],
  car360: ['damage_detection'],
  wheels: ['damage_detection', 'wheel_analysis'],
  classic: ['damage_detection', 'wheel_analysis'],
};

export default function useCreateInspection() {
  const dispatch = useDispatch();
  const [inspectionId, setInspectionId] = useState();

  const axiosRequest = useCallback(async () => {
    const tasks = {};
    Object.values(TASKS_BY_MOD)
      .forEach((modTasks) => modTasks
        .forEach((taskName) => { tasks[taskName] = { status: 'NOT_STARTED' }; }));

    return monk.entity.inspection.upsertOne({ data: { tasks } });
  }, []);

  const handleRequestSuccess = useCallback(({ entities, result }) => {
    setInspectionId(result);
    dispatch(monk.actions.gotOneInspection({ entities, result }));
  }, [dispatch]);

  const request = useRequest(
    axiosRequest,
    handleRequestSuccess,
    () => false,
  );

  return { ...request, inspectionId };
}
