import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRequest } from '@monkvision/toolkit';
import monk from '@monkvision/corejs';

const TASKS_BY_MOD = {
  car360: 'damage_detection',
  wheelAnalysis: 'wheel_analysis',
  repairEstimate: 'repair_estimate',
  imagesOCR: 'images_ocr',
  video: 'video',
};

export default function useCreateInspection() {
  const dispatch = useDispatch();
  const [inspectionId, setInspectionId] = useState();

  const axiosRequest = useCallback(async ({ captureMod }) => {
    const data = {
      tasks: {
        [TASKS_BY_MOD[captureMod]]: { status: 'NOT_STARTED' },
        [TASKS_BY_MOD.imagesOCR]: { status: 'NOT_STARTED' },
      },
    };

    return monk.entity.inspection.upsertOne({ data });
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
